import { ChannelStats,  Contributions, Teams,Providers  } from './blocks';
import { Users } from '../../../network/user-table/team-crew/blocks/users/Users';

const Demo1LightSidebarContent = () => {
  return <div className="grid gap-5 lg:gap-7.5">
      <div className="grid lg:grid-cols-3 gap-y-5 lg:gap-7.5 items-stretch">
        <div className="lg:col-span-1">
          <div className="grid grid-cols-2 gap-5 lg:gap-7.5 h-full items-stretch">
            <ChannelStats />
          </div>
        </div>

        <div className="lg:col-span-2 h-full">
          <Users/>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5 lg:gap-7.5 items-stretch">
      <div className="lg:col-span-2 h-full">
          <Teams/>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5 lg:gap-7.5  items-stretch">
        <div className="lg:col-span-1 h-full">
          <Contributions title="Providers Type" />
        </div>

        <div className="lg:col-span-2 h-full">
          <Providers />
        </div>
      </div>
    </div>;
};
export { Demo1LightSidebarContent };