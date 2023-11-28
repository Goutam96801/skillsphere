"use client";
import {Layout, Compass, List, BarChart, Braces} from "lucide-react";

import SidebarItem from "./sidebar-item";
import { usePathname } from "next/navigation";

const guestRoutes = [
    {
        icon: Layout,
        label: "Dashboard",
        href: "/",
    },
    {
        icon: Compass,
        label:"All Courses",
        href:"/search"
    },
    {
        icon: Braces,
        label:"Compiler",
        href:"/compiler"
    },
];

const adminRoutes = [
    {
        icon: List,
        label: "Courses",
        href: "/admin/courses",
    },
    {
        icon: BarChart,
        label:"Analytics",
        href:"/admin/analytics"
    },
]

const SidebarRoutes = () => {
    const pathname = usePathname();

    const isAdminPage = pathname?.includes("/admin");

    const routes = isAdminPage ? adminRoutes : guestRoutes;
    
    return ( 
        <div className="flex flex-col w-full">
            {routes.map((route)=>(
                <SidebarItem
                    key={route.href}
                    icon={route.icon}
                    label={route.label}
                    href={route.href}
                />
            ))}
        </div>
     );
}
 
export default SidebarRoutes;