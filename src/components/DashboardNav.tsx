

const DashboardNav = () => {
    return (
        <nav className="l-mobileTopNav">
        <div aria-expanded="false" aria-label="expand sidebar" className="collapseIcon js-toggleSidebarMobile collapseIcon-is-collapsed js-interactiveElement" role="button" tabIndex={0}>
        <i aria-hidden="true" className="fa fa-chevron-left collapseIcon--leftArrow"></i>
        <i aria-hidden="true" className="fa fa-bars collapseIcon--hamburger"></i>
        <i aria-hidden="true" className="fa fa-chevron-right collapseIcon--rightArrow"></i>
        </div>
        <div className="logo">
        <a aria-label="Gradescope: Back to Home" href="/">
            <img alt="Gradescope" src="https://cdn.gradescope.com/assets/logo/logo_endorsed-ea37018bcd9aefba905d7cf51c16e0979ca8d5eb43fae7c26a66230fc01e285b.svg"/>
        </a>
        </div>
        </nav>
    );
}

export default DashboardNav;

