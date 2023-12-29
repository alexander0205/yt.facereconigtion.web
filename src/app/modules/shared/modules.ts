import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { MultiSelectModule } from "primeng/multiselect";
import { TableModule } from "primeng/table";
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputTextModule } from 'primeng/inputtext';

import { FileUploadModule } from 'primeng/fileupload';
import { TranslateModule } from '@ngx-translate/core';
import { } from 'primeng/dropdown';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { BadgeModule } from 'primeng/badge';
import { ChipsModule } from 'primeng/chips';
import { RippleModule } from 'primeng/ripple';
import { TagInputModule } from 'ngx-chips';
import { AvatarModule } from 'primeng/avatar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TabViewModule } from 'primeng/tabview';
import { SliderModule } from "primeng/slider";
import { NgxMaskModule } from "ngx-mask";
import { TooltipModule } from 'primeng/tooltip';
import { TreeModule } from 'primeng/tree';
import { FileSaverModule } from "ngx-filesaver";
export const modules = [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    TableModule,
    MultiSelectModule,
    ContextMenuModule,
    SliderModule,
    DialogModule,
    DropdownModule,
    ProgressBarModule,
    InputTextModule,
    NgxMaskModule.forRoot(),
    FileUploadModule,
    TranslateModule,
    MessagesModule,
    MessageModule,
    RippleModule,
    BadgeModule,
    ChipsModule,
    AvatarModule,
    InputTextModule,
    ToggleButtonModule,
    TabViewModule,
    TreeModule,
    FileSaverModule,
    TooltipModule
]