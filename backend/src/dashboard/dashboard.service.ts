import { Injectable } from '@nestjs/common'

@Injectable()
export class DashboardService {
  stats() {
    return { totalResidents: 2, openComplaints: 1, inProgress: 1, resolved: 0 }
  }
}

