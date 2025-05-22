import { Fragment } from 'react';
// import { Link } from 'react-router-dom';
import { Container } from '@/components/container';
import { Toolbar, ToolbarDescription,ToolbarActions, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { TeamContent } from './';
import { useLayout } from '@/providers';
import { Link } from 'react-router-dom';
const TeamPage = () => {
  const {
    currentLayout
  } = useLayout();
  return <Fragment>
      {currentLayout?.name === 'demo1-layout' && <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription></ToolbarDescription>
              </ToolbarHeading>
              <ToolbarActions>
              {/* <a href="#" className="btn btn-sm btn-light">
                Upload CSV
              </a> */}
              <Link to="/addmember" className="btn btn-outline btn-primary cursor-pointer">
              Add Member
                <i className="ki-filled ki-plus-squared"></i>
              </Link>
            </ToolbarActions>

          </Toolbar>
        </Container>}

      <Container>
        <TeamContent />
      </Container>
    </Fragment>;
};
export { TeamPage };