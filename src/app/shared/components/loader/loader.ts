import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [NgIf],
  templateUrl: './loader.html',
  styleUrl: './loader.scss',
})
export class Loader {
  @Input() loading = false;
}
