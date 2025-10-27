/**
 * Studio Page
 *
 * Main studio workspace with sidebar and canvas.
 */

import AuroraBackground from '@/components/atoms/AuroraBackground';
import Sidebar from '@/components/organisms/Sidebar';
import SidebarToggle from '@/components/atoms/SidebarToggle';
import RightSidebar from '@/components/organisms/RightSidebar';
import RightSidebarToggle from '@/components/atoms/RightSidebarToggle';
import TopBar from '@/components/organisms/TopBar';
import TopBarToggle from '@/components/atoms/TopBarToggle';
import BottomBar from '@/components/organisms/BottomBar';
import BottomBarToggle from '@/components/atoms/BottomBarToggle';
import Canvas from '@/components/organisms/Canvas';

export default function StudioPage() {
  return (
    <>
      {/* Aurora Background */}
      <AuroraBackground />

      {/* Top Bar */}
      <TopBar />
      <TopBarToggle />

      {/* Left Sidebar */}
      <Sidebar />
      <SidebarToggle />

      {/* Right Sidebar */}
      <RightSidebar />
      <RightSidebarToggle />

      {/* Bottom Bar */}
      <BottomBar />
      <BottomBarToggle />

      {/* Canvas Area */}
      <Canvas />
    </>
  );
}
