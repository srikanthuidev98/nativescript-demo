import { Component, OnInit } from '@angular/core';
import { Emitter, Emittable } from '@ngxs-labs/emitter';
import { Select } from '@ngxs/store';
import { first } from 'rxjs/operators';
import { DialogHelper, RouterHelper, LocationHelper, LoadingHelper, convertToBase64String } from '../../../../ACCommon/helpers';
import { AppState } from '../../../../ACCommon/states/app.state';
import { Client, DualClient, GeofencingEvent, ScheduleVisit, SubmitActionRequest } from '../../../../ACCommon/models';
import { SubmitActionType, PayRateType, GeofencingOrigin } from '../../../../ACCommon/enums';
import { isAndroid, Page } from 'tns-core-modules/ui/page/page';
import { TNSRecorder, AudioRecorderOptions } from 'nativescript-audio';
import { Observable } from 'rxjs';
import { View, isIOS } from 'tns-core-modules/ui/core/view';
import { FileStorageService } from '../../../../ACCommon/storage/file-storage';
import { ActivatedRoute } from '@angular/router';
import { DateService } from '../../../../ACCommon/services/date.service';

@Component({
    selector: 'app-record-audio',
    templateUrl: './record-audio.component.html',
    styleUrls: ['./record-audio.component.scss']
})
export class RecordAudioComponent implements OnInit {
    public static animation;

    @Select(AppState.getCurrentSubmitActionRequest) currentSubmitAction$: Observable<SubmitActionRequest>;
    @Select(AppState.getCurrentClient) client$: Observable<Client>;
    @Select(AppState.getCurrentDualClient) dualClient$: Observable<DualClient>;

    @Emitter(AppState.submitAction)
    public submitAction: Emittable<SubmitActionRequest>;

    @Emitter(AppState.updateCurrentSubmitActionRequest)
    public updateCurrentSubmitActionRequest: Emittable<SubmitActionRequest>;

    private _recorder: TNSRecorder;
    private _meterInterval: any;
    private fileName = '';
    private audioMeter = '0';
    private modulate = true;
    private allBars: any[] = [];

    public audioHasBeenRecorded = false;    // Button was tapped and something was recorded.
    public soundRecorded = false;           // Verified that the user has said something during the recording.
    public isRecording: boolean;
    public title = 'Check In Audio';
    public audioType: 'checkin' | 'checkout' = 'checkin';

    private timerInterval: any;
    public seconds = '00';
    public milliseconds = '00';

    private scheduledVisit: ScheduleVisit;

    constructor(private routerHelper: RouterHelper, private dialogHelper: DialogHelper, private route: ActivatedRoute,
        private loadingHelper: LoadingHelper, private locationHelper: LocationHelper, private page: Page) {}

    ngOnInit() {
        this.scheduledVisit = JSON.parse(this.route.snapshot.paramMap.get('visit'));

        if (this.scheduledVisit) {
            this.scheduledVisit.checkInTime = new Date(this.scheduledVisit.checkInTime);
            this.scheduledVisit.checkOutTime = new Date(this.scheduledVisit.checkOutTime);
        }
        this.page.on('navigatingFrom', (args) => {
            this.modulate = false;
            if (this.isRecording) {
                this.stopRecord();
            }

            if (args.isBackNavigation && this.fileName) {
                FileStorageService.deleteAudioFile(this.fileName);
            }
        });

        console.log(FileStorageService.getFilePath(''));
        this._recorder = new TNSRecorder();
        this._recorder.debug = false; // set true for tns_recorder logs

        this.client$.pipe(first()).subscribe(c => {
            if (!c) { // Checks if client exists, if not, is dualClient. So change client to c1 of Dual Client.
                this.dualClient$.pipe(first()).subscribe(dualClient => {
                    c = dualClient.c1;
                });
            }

            if (c) {
                if (c.PayRateType === PayRateType.Daily) {
                    this.title = 'Check Out Audio';
                    this.audioType = 'checkout';
                } else {
                    this.currentSubmitAction$.pipe(first()).subscribe(currentSA => {
                        if (currentSA) {
                            this.title = 'Check Out Audio';
                            this.audioType = 'checkout';
                        }
                    });
                }
            }
        });

        this.locationHelper.isLocationEnabled();
    }

    loadBars(view: View, position: number, x: number) {
        this.allBars.push({ view: view, position: position, x: x });
    }

    animateAll() {
        this.allBars.forEach(bar => {
            this.animate(bar.view, bar.position, bar.x);
        });
    }

    animate(view: View, position: number, x: number) {
        if (!this.modulate) {
            return;
        }

        const amplitude = this.getAmplitude() * position;

        view.animate({
            scale: { x: 1, y: amplitude },
            duration: 1,
            delay: x * 10
        }).then(() => {
            // console.log('Modulation running');
            if (this.modulate) {
                this.animate(view, position, x);
            } else {
                console.log('Modulation Ended');
                return;
            }
        }).catch(e => {
            console.log('Modulation Error ' + e.message);
        });
    }

    private getAmplitude(): number {
        if (this.audioMeter === '0') {
            return 0;
        }

        let amplitude: number;
        if (isAndroid) { // Android calculation
            amplitude = parseFloat(this.audioMeter) * 0.001;
        } else { // IOS calculation
            amplitude = (parseFloat(this.audioMeter) + 30) * 0.5;
        }

        return amplitude;
    }

    public async record() {
        if (this.isRecording) {
            if (+this.seconds >= 2) { // Recording has to be greater than 2 seconds.
                this.stopRecord();
                this.stopTimer();
            }
        } else {
            this.startRecord();
            this.startTimer();
        }
    }

    private startTimer() {
        this.milliseconds = '00';
        this.seconds = '00';

        const start = new Date();
        this.timerInterval = setInterval(() => {
            const now = new Date();
            const _time = now.getTime() - start.getTime();
            const time = Math.round(_time / 10);
            const actualTime = ('0000' + `${time}`).substr(-4);

            this.seconds = actualTime.substr(0, 2);
            this.milliseconds = actualTime.substr(2, 2);

            if (this.seconds === '10') {
                this.milliseconds = '00';
                this.stopRecord();
                this.stopTimer();
            }
        }, 20);
    }

    private stopTimer() {
        clearTimeout(this.timerInterval);
    }

    public async startRecord() {
        try {
            if (!TNSRecorder.CAN_RECORD()) {
                this.dialogHelper.alert('This device cannot record audio.');
                return;
            }

            if (this.fileName) {
                FileStorageService.deleteAudioFile(this.fileName);
                this.fileName = '';
            }

            this.soundRecorded = false;
            this.modulate = true;
            this.animateAll();

            let androidFormat;
            let androidEncoder;
            if (isAndroid) {
                // m4a
                // androidFormat = android.media.MediaRecorder.OutputFormat.MPEG_4;
                androidFormat = 2;
                // androidEncoder = android.media.MediaRecorder.AudioEncoder.AAC;
                androidEncoder = 3;
            }

            this.fileName = FileStorageService.createFileName(this.audioType, '.m4a');
            const recordingPath = FileStorageService.getFilePath(this.fileName);
            const recorderOptions: AudioRecorderOptions = {
                filename: recordingPath,
                metering: true,
                format: androidFormat,

                encoder: androidEncoder,
                infoCallback: infoObject => {
                    console.log(JSON.stringify(infoObject));
                },

                errorCallback: errorObject => {
                    console.log(JSON.stringify(errorObject));
                }
            };
            await this._recorder.start(recorderOptions);
            this.isRecording = true;
            if (recorderOptions.metering) {
                this._initMeter();
            }
        } catch (err) {
            this.isRecording = false;
            this._resetMeter();
            this.dialogHelper.alert(err);
        }
    }

    public async stopRecord() {
        this.modulate = false;
        this._resetMeter();
        await this._recorder.stop().catch(ex => {
            console.log(ex);
            this.isRecording = false;
            this._resetMeter();
        });

        this.isRecording = false;
        this._resetMeter();
        this.audioHasBeenRecorded = true;
    }

    private _initMeter() {
        this._resetMeter();
        this._meterInterval = setInterval(() => {
            this.audioMeter = this._recorder.getMeters();
            const amplitude = this.getAmplitude();
            if (isAndroid && amplitude < 4) {
            } else if (isIOS && amplitude === -65) { // Only for iOS emulators. Because the audio doesn't work correctly.
                this.soundRecorded = true;
            } else if (isIOS && amplitude < 2) {
            } else {
                this.soundRecorded = true;
            }

        }, 100);
    }

    private _resetMeter() {
        if (this._meterInterval) {
            this.audioMeter = '0';
            clearInterval(this._meterInterval);
            this._meterInterval = undefined;
        }
    }

    continueTap() {
        this.loadingHelper.showIndicator();

        this.client$.pipe(first()).subscribe(client => {
            this.dualClient$.pipe(first()).subscribe(dualClient => {
                if (!client) { // Checks if client exists, if not, is dualClient. So change client to c1 of Dual Client.
                    client = dualClient.c1;
                }

                this.locationHelper.checkLocation(client).then((geoEvent: GeofencingEvent) => {
                    this.currentSubmitAction$.pipe(first()).subscribe(currentSA => {
                        if (currentSA) {
                            // Current shift exsists. Meaning they are checked in.
                            currentSA.visit.ActionType = SubmitActionType.CheckOut;
                            geoEvent.EventType = GeofencingOrigin.checkOut;

                            const base64Audio = convertToBase64String(FileStorageService.getFilePath(this.fileName));
                            currentSA.visit.CheckOutAudio = base64Audio;
                            FileStorageService.deleteAudioFile(this.fileName);

                            currentSA.visit.GeofencingEvents.push(geoEvent);
                            this.updateCurrentSubmitActionRequest.emit(currentSA);
                            this.locationHelper.disableWatchLocation();

                            if (client.askCheckOutQuestions && client.Questions && client.Questions.length > 0) {
                                this.routerHelper.navigate(['/status/additional-questions', { from: 'checkout'}]);
                            } else {
                                this.routerHelper.navigate(['status/checkout-activities']);
                            }
                        } else {
                            const submitActionRequest: SubmitActionRequest = {
                                visit: {
                                    ActionType: SubmitActionType.None,
                                    GeofencingEvents: []
                                }
                            };

                            if (client.PayRateType === PayRateType.Daily) {
                                // Daily - No checkin required
                                if (this.scheduledVisit) { // Checking in for daily for yesterday's scheduled visit
                                    submitActionRequest.visit.CheckInTime = DateService.getString(this.scheduledVisit.checkInTime);
                                    submitActionRequest.visit.CheckOutTime = DateService.getString(this.scheduledVisit.checkInTime);
                                }
                                submitActionRequest.visit.ActionType = SubmitActionType.Daily;
                                geoEvent.EventType = GeofencingOrigin.checkOut;

                                const base64Audio = convertToBase64String(FileStorageService.getFilePath(this.fileName));
                                submitActionRequest.visit.CheckOutAudio = base64Audio;
                                FileStorageService.deleteAudioFile(this.fileName);

                                submitActionRequest.visit.GeofencingEvents.push(geoEvent);
                                this.updateCurrentSubmitActionRequest.emit(submitActionRequest);
                                this.routerHelper.navigate(['status/checkout-activities']);
                            } else {
                                // Checking in to regular shift.
                                geoEvent.EventType = GeofencingOrigin.checkIn;
                                submitActionRequest.visit.ActionType = SubmitActionType.CheckIn;
                                submitActionRequest.visit.CheckInTime = DateService.getString(new Date());
                                submitActionRequest.visit.GeofencingEvents.push(geoEvent);

                                const base64Audio = convertToBase64String(FileStorageService.getFilePath(this.fileName));
                                submitActionRequest.visit.CheckInAudio = base64Audio;
                                FileStorageService.deleteAudioFile(this.fileName);
                                console.log('submitActionRequest: ',submitActionRequest)
                                this.submitAction.emit(submitActionRequest);
                            }
                        }
                    });
                }, error => {
                    this.loadingHelper.hideIndicator();
                    console.log(error);
                });
            });
        });
    }
}
