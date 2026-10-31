import { Component, OnDestroy, OnInit, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-countdown-component',
  templateUrl: './countdown-component.html',
  styleUrls: ['./countdown-component.css']
})
export class CountdownComponent implements OnInit, OnDestroy {

  searchModeEnd = input<number>(0);

  ended = output<void>();

  remainingTime = signal<string>('00:00');

  private intervalId: any;

  ngOnInit(): void {
    this.startCountdown();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  startCountdown(): void {

    this.updateCountdown();

    this.intervalId = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  updateCountdown(): void {
    const now = Date.now();
    const distance = this.searchModeEnd() - now;

    if (distance <= 0) {
      clearInterval(this.intervalId);
      chrome.storage.local.remove([
        'searchMode',
        'searchModeEnd'
      ]);
      this.ended.emit();
      return;
    }

    const hours = Math.floor(distance / (1000 * 60 * 60));
    const minutes = Math.floor(
      (distance % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor(
      (distance % (1000 * 60)) / 1000
    );

    this.remainingTime.set(
      hours > 0
        ? `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`
        : `${this.pad(minutes)}:${this.pad(seconds)}`);
  }

  pad(value: number): string {
    return value.toString().padStart(2, '0');
  }
}