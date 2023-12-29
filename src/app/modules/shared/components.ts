import { dateMaskDirective } from './_directives/dateInputMask.directive'
import { SpecialCharacterDirective } from './_directives/specialCharacter.directive'
import { ClickStopPropagation } from './_directives/stopPropagation.directive'
import { DropdownComponent } from './_elements/element-ui/dropdown/dropdown.component'
import { DynamicFormatComponent } from './_elements/element-ui/dynamic-format/dynamic-format.component'
import { EllipsisComponent } from './_elements/element-ui/ellipsis/ellipsis.component'
import { FileReaderComponent } from './_elements/element-ui/file-reader/file-reader.component'
import { FileUploaderComponent } from './_elements/element-ui/file-uploader/file-uploader.component'
import { MapComponent } from './_elements/element-ui/map/Map.component'
import { PrimeTableComponent } from './_elements/element-ui/prime-table/prime-table.component'
import { ProfileInfoComponent } from './_elements/element-ui/profile-info/profile-info.component'
import { SaveWarningComponent } from './_elements/element-ui/save-warning/save-warning/save-warning.component'
import { TreeFilesComponent } from './_elements/element-ui/tree-files/tree-files.component'
import { NotificationBellComponent } from './_elements/notification-bell/notification-bell.component'





export const components = [

    DropdownComponent,
    DynamicFormatComponent,
    EllipsisComponent,
    PrimeTableComponent,
    FileUploaderComponent,
    FileReaderComponent,
    NotificationBellComponent,
    ProfileInfoComponent,
    SaveWarningComponent,
    TreeFilesComponent,
    SpecialCharacterDirective,
    ClickStopPropagation,
    dateMaskDirective,
    MapComponent
]