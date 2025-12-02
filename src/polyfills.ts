import '@angular/localize/init';
import 'zone.js';

// Polyfill for Node.js buffer in browser
import { Buffer } from 'buffer';

(window as any).Buffer = Buffer;
