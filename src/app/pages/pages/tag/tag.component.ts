import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputText, InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagService } from '@/services/tag-service';
import { Tag, ITag } from '@/models/tag.model';
import { Checkbox } from 'primeng/checkbox';
import { Drawer } from 'primeng/drawer';
import { MultiSelect } from 'primeng/multiselect';



interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    selector: 'app-tags',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        TextareaModule,
        SelectModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule,
        InputText,
        Drawer,
        Checkbox,
        MultiSelect
    ],
    templateUrl: "tag.component.html",
    providers: [MessageService, TagService, ConfirmationService]
})
export class TagComponent implements OnInit {
    createDialog: boolean = false;

    tags = signal<ITag[]>([]);


    tag!: ITag;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    constructor(
        private tagService: TagService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    exportCSV() {
        this.dt.exportCSV();
    }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.tagService.findAll()
            .subscribe(res => this.tags.set(res.body ?? []));

        this.cols = [
            { field: 'id', header: 'Id' },
            { field: 'name', header: 'Name' },
        ];
        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));

    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.tag = new Tag();
        this.submitted = false;
        this.createDialog = true;
    }

    editTag(tag: Tag) {
        this.tag = { ...tag };

        this.createDialog = true;
    }


    hideDialog() {
        this.createDialog = false;
        this.submitted = false;
    }

    deleteTag(tag: Tag) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete Tag ?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.tags.set(this.tags().filter((val) => val.id !== tag.id));
                this.tag = {};
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Tag Deleted',
                    life: 3000
                });
            }
        });
    }

    findIndexById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.tags().length; i++) {
            if (this.tags()[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }


    saveTag() {
        this.submitted = true;

            if (this.tag.id) {
                this.tagService.update(this.tag)
                    .subscribe(res => {
                        if (res.body) {
                            this.tags.set(
                                this.tags().map((tag) => res.body && res.body.id === tag.id ? res.body : tag)
                            );
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Successful',
                                detail: 'Language Updated',
                                life: 3000
                                });
                            }
                        });

            } else {
                this.tagService.create(this.tag)
                    .subscribe(res => {
                        if (res.body?.id) {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Successful',
                                detail: 'Product Created',
                                life: 3000
                            });

                            this.tags().push(res.body);
                        }

                    })

            }

            this.createDialog = false;
            this.tag = {};


    }
}
