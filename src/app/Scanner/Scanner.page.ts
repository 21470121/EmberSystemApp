import { Component } from '@angular/core';
import { ElementRef, ViewChild } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import jsQR from 'jsqr';
import { ScannerService } from '../_services/scanner_service';

@Component({
  selector: 'app-Scanner',
  templateUrl: 'Scanner.page.html',
  styleUrls: ['Scanner.page.scss']
})
export class ScannerPage {
  scanActive = false;
  scanResult: string | null = null;;
  successModalOpen = false;
  errorModalOpen = false;
  successMessage = '';
  errorMessage = '';
  @ViewChild('video', {static: false}) video!: ElementRef;
  @ViewChild('canvas', {static: false}) canvas!: ElementRef;
  videoElement :any;
  canvasElement: any;
  canvasContext : any;
  loading: HTMLIonLoadingElement | null = null;
  constructor(private toastCtrl : ToastController, private LoadingCtrl: LoadingController, private service: ScannerService, private alertCtrl: AlertController,) {}
   
  ngAfterViewInit(){
    this.videoElement = this.video.nativeElement;
    this.canvasElement = this.canvas.nativeElement;
    this.canvasContext = this.canvasElement.getContext('2d');
  }

  async startScan() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
  
      this.videoElement.srcObject = stream;
      this.videoElement.setAttribute('playsinline', 'true'); 
      await this.videoElement.play();
      this.loading = await this.LoadingCtrl.create({});
      await this.loading.present();
      requestAnimationFrame(this.scan.bind(this));
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  }


  async scan(){
    console.log('SCAN');
    if(this.videoElement.readyState === this.videoElement.HAVE_ENOUGH_DATA){
      if(this.loading){
        await this.loading.dismiss();
        this.loading = null;
        this.scanActive = true;
      }

      this.canvasElement.height = this.videoElement.videoHeight;
      this.canvasElement.width = this.videoElement.videoWidth;

      this.canvasContext.drawImage(
        this.videoElement,
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );

      const imageData = this.canvasContext.getImageData(
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );

      const code = jsQR(imageData.data, imageData.width, imageData.height,{
        inversionAttempts: 'dontInvert'
      });

      console.log('QRCode:', code);

      if (code){
        this.scanActive = false;
        this.scanResult= code.data;
        this.handleQRCode(this.scanResult);
        //this.showOfToast();
      } else{
        if(this.scanActive){
          requestAnimationFrame(this.scan.bind(this));
        }
      }

    } else {
      requestAnimationFrame(this.scan.bind(this));
    }
  }

  reset
  (){
    this.scanResult = null;
  }

  stopScan(){
    this.scanActive = false;
  }

  handleQRCode(data: string) {
    this.service.verifyOrder(data).subscribe(
      response => {
        this.showSuccessModal('Order #'  + ' completed successfully!');
        console.log("worked")
      },
      error => {
       this.showErrorModal('Error completing order: ');
       console.log("didn't")
      }
    );
  }

  async showSuccessModal(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Success',
      message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Complete Order',
          handler: () => {
           this.service.completeOrder(this.scanResult!).subscribe(
            response => {
              console.log("worked -order complete")
            },
            error => {
             console.log("didn't - order not complete")
            }
          );
          }
        }
      ]
    });

    await alert.present();
  }

  closeSuccessModal() {
    this.successModalOpen = false;
    this.successMessage = '';
  }

  async showErrorModal(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Error getting order',
      message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.reset()
          }
        }
      ]
    });

    await alert.present();
  }

  closeErrorModal() {
    this.errorModalOpen = false;
    this.errorMessage = '';
  }
}
