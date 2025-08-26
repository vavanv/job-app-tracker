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
  templateUrl: './simple-input.component.html',
  styleUrls: ['./simple-input.component.css']
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