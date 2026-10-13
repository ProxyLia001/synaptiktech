import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Brand } from "./brand";

const navigation = [{ to: "/", label: "Home" }, { to: "/about", label: "About" }, { to: "/research", label: "Research & Innovation" }, { to: "/projects", label: "Projects" }] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: state => state.location.pathname });
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  return <><a className="skip-link" href="#main-content">Skip to content</a><header className="site-header"><div className="container header-inner"><Link to="/" aria-label="Synaptik home"><Brand /></Link><nav className="desktop-nav" aria-label="Main navigation">{navigation.map(item => <Link key={item.to} to={item.to} className={pathname === item.to ? "nav-active" : ""} aria-current={pathname === item.to ? "page" : undefined}>{item.label}</Link>)}</nav><Button asChild variant="quiet" className="desktop-contact"><Link to="/contact">Let’s connect <ArrowUpRight size={16}/></Link></Button><Button variant="ghost" size="icon" className="menu-toggle" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</Button></div>{open && <nav id="mobile-navigation" className="mobile-nav container" aria-label="Mobile navigation">{navigation.map(item => <Link key={item.to} to={item.to} aria-current={pathname === item.to ? "page" : undefined}>{item.label}<ArrowUpRight size={18}/></Link>)}<Link to="/contact">Let’s connect<ArrowUpRight size={18}/></Link></nav>}</header></>;
}

export function SiteFooter() {
  return <footer className="site-footer"><div className="container footer-inner"><Link to="/" aria-label="Synaptik home"><Brand small/></Link><p>At the intersection of the brain and possibility.</p><span>© {new Date().getFullYear()} Synaptik</span></div></footer>;
}