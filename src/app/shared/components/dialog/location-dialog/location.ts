import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Loader } from '../../loader/loader';

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatButtonModule,
    Loader,
  ],
  templateUrl: './location.html',
  styleUrl: './location.scss',
})
export class LocationDialog {
  locationForm!: FormGroup;
  loading = false;
  regions = ['North', 'North East', 'Central', 'South West', 'South', 'Water Source and Treatment', 'Sewer Treatment and Plant', 'Recycled water', 'Head office', 'South East',];
  officeTypes = ['Area', 'Department'];
  northareas = ['Area 1 - Thiruvottriyur', 'Area 2 - Manali', 'Area 3 - Madhavaram'];
  northeastareas = ['Area 4 - Tandiarpet', 'Area 5 - Royapuram', 'Area 6 - Thiru vi ka nagar'];
  centralareas = ['Area 7 - Ambattur', 'Area 8 - Anna nagar', 'Area 9 - Teynampet']
  southwestareas = ['Area 10 - Kodambakkam', 'Area 11 - Valasaravakkam', 'Area 12 - Alandur'];
  southareas = ['Area 13 - Adyar', 'Area 14 - Perungudi', 'Area 15 - Shollinganallur'];
  watersourceareas = ['No Area Dept'];
  sewagetreatmentareas = ['Outside City'];
  watersourcedept = ['Surface Water', 'Desal Water', 'Well Field', 'Quarries'];
  sewagetreatmentdept = ['STP North', 'STP South',];
  recycledwaterdept = ['TTRO', 'TTUF',];
  headofficedept = ['Corporate Office', 'Engineering Department', 'Finance Department', 'IT Department', 'Administration Department', 'IT Hardware', 'IT Software', 'PA Civil', 'PA Mech', 'PA Electrical',];
  areasubOffices = ['Area Office', 'Depot', 'FP', 'SPS', 'WDS'];
  deptsubOffices  = ['Administration Department', 'Corporate Office', 'Desal Water', 'Engineering Department', 'Finance Department', 'IT Department', 'Quarries', 'STP North', 'STP South', 'Surface Water', 'TTRO', 'TTUF', 'Well Field', ];
  area1depots =['DEP 10 - Thiruvottiyur, West Mada Street, Ch - 19', 'DEP 11 - Thiruvottiyur, Ellaiamman Koil Street, Ch - 19', 'DEP 12 - Thiruvottiyur, Kaladipet, Ch - 19', 'DEP 13 - Thiruvottiyur, Sathuma Nagar, Ch - 19', 'DEP 14 - Thangal, Thiyagarayapuram, Ch - 19', 'DEP 1 - Ennore, Thalangkuppam, Ch - 57', 'DEP 2 - Ennore, Kathivakkam Railway Station Road, Ch - 57', 'DEP 3 - Annai Sivagami Nagar, Ch - 57', 'DEP 4 - Ennore booster, T.H. Road, Ch - 57', 'DEP 5 - Wimco, Neithal Nagar, Ch - 19', 'DEP 6 - Ennore, Sathiyamoorthy Nagar, Ch - 57', 'DEP 7 - Thiruvottiyur, Ramasamy Nagar, Ch - 19', 'DEP 8 - K.R.Ramasamy Nagar, Beach Road, Ch - 19', 'DEP 9 - Theradi, Thiruvottiyur, Ch - 19', ]
  area1fp = ['Kathivakkam', 'Neithal Nagar', 'Ramasamy Nagar'];
  area1sps = ['Anna Nagar', 'Annasivagami Nagar ', 'Basin Road', 'Bharathiyar Nagar', 'Ellaiamman Koil', 'Jai Hind Nagar', 'Kamalamal Nagar', ];
  area1wds = ['Commercial Complex, Kathivakkam', 'Ellaiamman Koil Headworks', 'Manali WDS (Thiruvottiyur)', 'Thalankuppam', 'Thiyagarayapuram Headworks'];
  area2depots = ['DEP 15 - Manali New Town, Block 57, Ch - 103', 'DEP 16 - Kadapakkam, Kanniampettai, Ch - 103', 'DEP 17 - Vadaperumbakkam, Kosappur Main Road, Ch - 90', 'DEP 18 - Manali, Nedunchezhian Salai, Ch - 68', 'DEP 19 -  Manali, M.M.D.A, Mathur, Ch - 68', 'DEP 20 - Manali, Chinna Mathur Salai, Ch - 68', 'DEP 21 - Manali, Thiruvengadam Street, Ch - 68', 'DEP 22 - Puzhal, Sakthivel Nagar, Ch - 66', ];
  area2fp= ['Manali New Town', 'MMDA Mathur'];
  area2sps= ['Manali  New Town', 'Mathur Pg. Station'];
  area2wds= ['Manali New Town', 'Mathur MMDA'];
  area3depots = ['DEP 23 - Puzhal, Chidambaram Nagar, Ch - 66', 'DEP 24 - Kadappa road, Ch - 99', 'DEP 25 - Kathirvedu, Padmavathy Nagar, Ch - 66', 'DEP 26 - Vinayagapuram, Umapathy Nagar, Ch - 99'];
  area3fp= ['Puckraj Nagar', 'Surapet'];
  area3sps= ['Bank Colony', 'Chandraprabu Colony', 'Kadappa Road Terminal Pumping Station', 'Madhanakuppam Lift Station'];
  area3wds= ['Thanikachalam Nagar'];

  
  constructor(
    public dialogRef: MatDialogRef<LocationDialog>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.createLocation();
    if (data) this.locationForm.patchValue(data);
  }

  createLocation() {
    this.locationForm = this.fb.group({
      regionName: ['', Validators.required],
      officeTypeName: ['', Validators.required],
      areaDeptName: ['', Validators.required],
      subOfficeTypeName: ['', Validators.required],
      depotLocation: ['', Validators.required],
    });
  }
  close() {
    this.dialogRef.close();
  }

  save() {
    this.loading = true;
    if (this.locationForm.valid) {
      this.dialogRef.close(this.locationForm.value);

      setTimeout(() => {
        this.loading = false;
      }, 1500);
    } else {
      this.locationForm.markAllAsTouched();
    }
    this.loading = false;
  }
}
