import { Directive, HostListener } from "@angular/core";

@Directive({
    selector: "[stopPropagation]"
})
export class ClickStopPropagation {
    @HostListener("click", ["$event"])
    public onClick(event: any): void {
        event.preventDefault()
        event.stopPropagation();
    }
}