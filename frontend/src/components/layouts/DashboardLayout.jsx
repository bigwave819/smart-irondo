import Navbar from './Navbar';
import SlideMenu from './sliderMenu';

const DashboardLayout = ({ children, activeMenu }) => {

  return (
    <div className=''>
      <Navbar activeMenu={activeMenu} />
        <div className='flex'>
          <div className='max-[1080px]:hidden'>
            <SlideMenu activeMenu={activeMenu} />
          </div>
          <div className='grow mx-5'>{children}</div>
        </div>
    </div>
  );
};

export default DashboardLayout;