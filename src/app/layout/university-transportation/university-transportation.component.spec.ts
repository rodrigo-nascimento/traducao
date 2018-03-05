import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversityTransportationComponent } from './university-transportation.component';

describe('UniversityTransportationComponent', () => {
  let component: UniversityTransportationComponent;
  let fixture: ComponentFixture<UniversityTransportationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UniversityTransportationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UniversityTransportationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
