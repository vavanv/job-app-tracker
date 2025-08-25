import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-simple-input',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SimpleInputComponent),
      multi: true
    }
  ],
  template: `
    <div class="simple-input-container">
      <label *ngIf="label" class="simple-label" [for]="inputId">{{ label }}</label>
      <input
        *ngIf="type !== 'textarea' && type !== 'select'"
        [id]="inputId"
        [type]="type"
        [placeholder]="placeholder"
        [value]="value"
        [disabled]="disabled"
        [required]="required"
        (input)="onInput($event)"
        (blur)="onBlur()"
        (focus)="onFocus()"
        class="simple-input"
        [class.focused]="isFocused"
        [class.has-value]="hasValue"
        [class.error]="hasError"
      />
      <select
        *ngIf="type === 'select'"
        [id]="inputId"
        [value]="value"
        [disabled]="disabled"
        [required]="required"
        (change)="onInput($event)"
        (blur)="onBlur()"
        (focus)="onFocus()"
        class="simple-input"
        [class.focused]="isFocused"
        [class.has-value]="hasValue"
        [class.error]="hasError">
        <option value="" disabled>{{ placeholder }}</option>
        <option *ngFor="let option of options" [value]="option.value">
          {{ option.label }}
        </option>
      </select>
      <textarea
        *ngIf="type === 'textarea'"
        [id]="inputId"
        [placeholder]="placeholder"
        [value]="value"
        [disabled]="disabled"
        [required]="required"
        (input)="onInput($event)"
        (blur)="onBlur()"
        (focus)="onFocus()"
        class="simple-input"
        [class.focused]="isFocused"
        [class.has-value]="hasValue"
        [class.error]="hasError"
        rows="4"
      ></textarea>
      <div class="error-message" *ngIf="errorMessage && hasError">
        {{ errorMessage }}
      </div>
    </div>
  `,
  styles: [`
    .simple-input-container {
      margin-bottom: 16px;
      width: 100%;
    }
    
    .simple-label {
      display: block;
      font-size: 14px;
      color: #666;
      margin-bottom: 4px;
      font-weight: 500;
    }
    
    .simple-input {
      width: 100%;
      padding: 8px 0;
      font-size: 16px;
      border: none;
      border-bottom: 1px solid #ddd;
      background: transparent;
      outline: none;
      transition: border-color 0.3s ease;
      box-sizing: border-box;
      resize: vertical;
      font-family: inherit;
    }
    
    textarea.simple-input {
       min-height: 80px;
       resize: vertical;
       border: none;
       border-bottom: 1px solid #ddd;
       border-radius: 0;
       background: transparent;
     }
     
     textarea.simple-input:focus {
       border-bottom-width: 2px;
       border-bottom-color: #1976d2;
     }
     
     textarea.simple-input.error {
        border-bottom-color: #f44336;
      }
      
      select.simple-input {
        border: none;
        border-bottom: 1px solid #ddd;
        border-radius: 0;
        background: transparent;
        appearance: none;
        background-image: url('data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 5"><path fill="%23666" d="M2 0L0 2h4zm0 5L0 3h4z"/></svg>');
        background-repeat: no-repeat;
        background-position: right 8px center;
        background-size: 12px;
        padding-right: 24px;
      }
      
      select.simple-input:focus {
        border-bottom-width: 2px;
        border-bottom-color: #1976d2;
      }
      
      select.simple-input.error {
        border-bottom-color: #f44336;
      }
    
    .simple-input:focus {
      border-bottom-color: #2196f3;
    }
    
    .simple-input:hover:not(:disabled) {
      border-bottom-color: #999;
    }
    
    .simple-input:disabled {
      color: #999;
      border-bottom-color: #eee;
      cursor: not-allowed;
    }
    
    .simple-input.error {
      border-bottom-color: #f44336;
    }
    
    .simple-input::placeholder {
      color: #999;
      opacity: 1;
    }
    
    .error-message {
      font-size: 12px;
      color: #f44336;
      margin-top: 4px;
      min-height: 16px;
    }
    
    /* Focus animation */
    .simple-input {
      position: relative;
    }
    
    .simple-input-container {
      position: relative;
    }
    
    .simple-input-container::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background-color: #2196f3;
      transition: width 0.3s ease;
    }
    
    .simple-input:focus ~ ::after,
    .simple-input.focused ~ ::after {
      width: 100%;
    }
    
    .simple-input:focus {
      border-bottom-width: 2px;
    }
  `]
})
export class SimpleInputComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() errorMessage: string = '';
  @Input() hasError: boolean = false;
  @Input() options: {value: string, label: string}[] = [];
  
  value: string = '';
  isFocused: boolean = false;
  inputId: string = `simple-input-${Math.random().toString(36).substr(2, 9)}`;
  
  private onChange = (value: string) => {};
  private onTouched = () => {};
  
  get hasValue(): boolean {
    return !!(this.value && this.value.length > 0);
  }
  
  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
  }
  
  onFocus(): void {
    this.isFocused = true;
  }
  
  onBlur(): void {
    this.isFocused = false;
    this.onTouched();
  }
  
  // ControlValueAccessor implementation
  writeValue(value: string): void {
    this.value = value || '';
  }
  
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}