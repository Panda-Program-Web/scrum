import { ScrumTeamQueryServiceDto } from '@panda-project/use-case';

// Mock data for demo purposes - in a real app this would come from an API
const mockScrumTeamData: ScrumTeamQueryServiceDto = {
  scrumTeam: {
    scrumMaster: {
      employeeId: 4,
      name: '竹内 太一',
      isDeveloper: false,
    },
    productOwner: {
      employeeId: 3,
      name: '丸山 茜',
      isDeveloper: true,
    },
    developers: [
      {
        employeeId: 1,
        name: '渡辺 誠',
      },
      {
        employeeId: 2,
        name: '井上 亮太',
      },
      {
        employeeId: 3,
        name: '丸山 茜',
      },
    ],
  },
};

export class MobileScrumTeamQueryService {
  async exec(): Promise<{ data: ScrumTeamQueryServiceDto; error: null }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      data: mockScrumTeamData,
      error: null,
    };
  }
}
