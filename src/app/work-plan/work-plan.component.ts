import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-work-plan',
  templateUrl: './work-plan.component.html',
  styleUrls: ['./work-plan.component.css']
})
export class WorkPlanComponent implements OnInit {
  requests = [
    {id: 0, name: 'req0', shiftsLength: 0.5, isConsecutive: false},
    {id: 5, name: 'req0', shiftsLength: 0.5, isConsecutive: false},
    {id: 1, name: 'req1', shiftsLength: 2, isConsecutive: true},
    {id: 2, name: 'req2', shiftsLength: 3, isConsecutive: true},
    {id: 3, name: 'req3', shiftsLength: 4, isConsecutive: false},
    {id: 4, name: 'req4', shiftsLength: 1, isConsecutive: false}
  ];
  workingDays = [
    {
      'dayIndex': 0,
      'id': 0,
      'isWorkingDay': true,
      'shiftsNumber': 3
    },
    {
      'dayIndex': 1,
      'id': 0,
      'isWorkingDay': true,
      'shiftsNumber': 2
    },
    {
      'dayIndex': 2,
      'id': 0,
      'isWorkingDay': true,
      'shiftsNumber': 3
    },
    {
      'dayIndex': 3,
      'id': 0,
      'isWorkingDay': true,
      'shiftsNumber': 2
    },
    {
      'dayIndex': 4,
      'id': 0,
      'isWorkingDay': true,
      'shiftsNumber': 1
    },
    {
      'dayIndex': 5,
      'id': 0,
      'isWorkingDay': false,
      'shiftsNumber': 0
    },
    {
      'dayIndex': 6,
      'id': 0,
      'isWorkingDay': false,
      'shiftsNumber': 0
    },
    {
      'dayIndex': 0,
      'id': 0,
      'isWorkingDay': true,
      'shiftsNumber': 2
    },
    {
      'dayIndex': 1,
      'id': 0,
      'isWorkingDay': true,
      'shiftsNumber': 2
    },
    {
      'dayIndex': 2,
      'id': 0,
      'isWorkingDay': false,
      'shiftsNumber': 0
    },
    {
      'dayIndex': 3,
      'id': 0,
      'isWorkingDay': true,
      'shiftsNumber': 1
    },
    {
      'dayIndex': 4,
      'id': 0,
      'isWorkingDay': true,
      'shiftsNumber': 1
    },
    {
      'dayIndex': 5,
      'id': 0,
      'isWorkingDay': true,
      'shiftsNumber': 2
    },
    {
      'dayIndex': 6,
      'id': 0,
      'isWorkingDay': false,
      'shiftsNumber': 0
    }
  ];
  workingDaysPerWeek = [];
  shiftsReq = [[[]]];
  shiftsReqColors = [[[]]];

  constructor() {
  }

  ngOnInit() {
    let week = [];
    let w = -1, d = 0, s = 0;
    for (const day of this.workingDays) {
      if (day.dayIndex == 0) {
        w++;
        this.shiftsReq[w] = [[]];
        this.shiftsReqColors[w] = [[]];
        week = [];
      }
      week.push(day);
      this.shiftsReq[w][d] = new Array(day.shiftsNumber).fill(null).map(() => ({firstR: null, secondR: null}));
      this.shiftsReqColors[w][d] = new Array(day.shiftsNumber).fill(null).map(() => ({firstR: null, secondR: null}));
      d++;
      if (day.dayIndex == 6) {
        d = 0;
        this.workingDaysPerWeek.push(week);
      }
    }

  }

  // drag & drop

  darggedData;
  consIndexArray = [];

  requestDragged(event: DragEvent, id: number, index: number) {
    this.requests.slice(index, 1);
    this.darggedData = this.getReqWithID(id);
  }

  dropRequest(event, w, d, s) {
    event.preventDefault();
    if(this.darggedData == null || (this.shiftsReq[w][d][s].firstR != null && this.shiftsReq[w][d][s].secondR != null && this.darggedData.shiftsLength == 0.5) ||
      (this.darggedData.shiftsLength == 0.5 && this.shiftsReq[w][d][s].firstR != null && this.shiftsReq[w][d][s].firstR.shiftsLength != 0.5) ||
      (this.shiftsReq[w][d][s].firstR != null && this.darggedData.shiftsLength != 0.5)) {
      let elem = event.target as HTMLDivElement;
      elem.classList.remove('dragOver');
      return;
    }
    let randomColor = this.getRandomColor();
    let numShift = this.darggedData.shiftsLength;
    //not Consecutive req
    if (numShift != 0) {
      for (let wi = w; wi < this.shiftsReq.length && (numShift != 0); wi++) {
        let di = wi == w ? d : 0;
        for (; di < this.shiftsReq[wi].length && (numShift != 0); di++) {
          let si = (wi == w && di == d) ? s : 0;
          for (; si < this.shiftsReq[wi][di].length && (numShift != 0); si++) {
            if (this.darggedData.shiftsLength == 0.5 && this.shiftsReq[wi][di][si].firstR == null) {
              this.shiftsReq[wi][di][si].firstR = this.darggedData;
              this.shiftsReqColors[wi][di][si].firstR = randomColor;
              numShift -= 0.5;
            } else if (this.darggedData.shiftsLength == 0.5 && this.shiftsReq[wi][di][si].secondR == null && this.shiftsReq[wi][di][si].firstR.shiftsLength == 0.5) {
              this.shiftsReq[wi][di][si].secondR = this.darggedData;
              this.shiftsReqColors[wi][di][si].secondR = randomColor;
              numShift -= 0.5;
            } else if (this.shiftsReq[wi][di][si].firstR == null && this.shiftsReq[wi][di][si].secondR == null && this.darggedData.isConsecutive) {
              //add available index's to the consIndexArray array
              let consIndex = {w: wi, d: di, s: si};
              this.consIndexArray.push(consIndex);
              numShift--;
            } else if (this.shiftsReq[wi][di][si].firstR == null && this.shiftsReq[wi][di][si].secondR == null) {
              this.shiftsReq[wi][di][si].firstR = this.darggedData;
              this.shiftsReqColors[wi][di][si].firstR = randomColor;
              numShift--;
            }
          }
        }
      }
    }
    //Consecutive req
    if (this.darggedData.isConsecutive == true) {
      numShift = this.darggedData.shiftsLength;
      //check if index's are Consecutive
      let canAddConsecutiveReq = true;
      let cw = this.consIndexArray[0].w, cd = this.consIndexArray[0].d, cs = this.consIndexArray[0].s;
      for (let i = 1; i < this.consIndexArray.length && canAddConsecutiveReq; i++) {
        //same week and day
        if (this.consIndexArray[i].w == cw && this.consIndexArray[i].d == cd) {
          if (this.consIndexArray[i].s - this.consIndexArray[i - 1].s != 1) {
            canAddConsecutiveReq = false;
            break;
          }
        }
        //same week
        else if (this.consIndexArray[i].w == cw && this.consIndexArray[i].d - cd == 1 && this.consIndexArray[i].s == 0) {
          for (let j = cs; j < this.shiftsReq[cw][cd].length; j++) {
            if (this.containsShiftIndexObject({w: cw, d: cd, s: j}, this.consIndexArray) == false) {
              canAddConsecutiveReq = false;
              break;
            }
          }
          cd = this.consIndexArray[i].d;
        } else {
          canAddConsecutiveReq = false;
          break;
        }
      }
      //add req to Consecutive if exist
      if (canAddConsecutiveReq) {
        this.consIndexArray.map((index) => {
          this.shiftsReq[index.w][index.d][index.s].firstR = this.darggedData;
          this.shiftsReqColors[index.w][index.d][index.s].firstR = randomColor;
          numShift--;
        });
      }

      this.consIndexArray = [];
    }

    console.log(this.consIndexArray);
    /////////////////////////////////////////////////////////////////
    //remove req
    if (numShift == 0) {
      this.removeReq(this.darggedData);
    }
    this.darggedData = null;
    let elem = event.target as HTMLDivElement;
    elem.classList.remove('dragOver');
  }


  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDragenter(event: DragEvent) {
    if (this.darggedData != null) {
      let elem = event.target as HTMLDivElement;
      elem.classList.add('dragOver');
    }

  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    let elem = event.target as HTMLDivElement;
    elem.classList.remove('dragOver');
  }

  removeReq(req): void {
    const index = this.requests.indexOf(req, 0);
    this.requests.splice(index, 1);
  }

  getReqWithID(id: number) {
    var relem = null;
    this.requests.map((elem) => {
      if (elem.id == id) {
        relem = elem;
      }
    });
    return relem;
  }

  getRandomColor() {
    var color = Math.floor(0x1000000 * Math.random()).toString(16);
    return '#' + ('000000' + color).slice(-6);
  }

  containsShiftIndexObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
      if (list[i].w === obj.w && list[i].d === obj.d && list[i].s === obj.s) {
        return true;
      }
    }
    return false;
  }
}
