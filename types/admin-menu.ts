export interface AdminMenuItem {
   id: string;
   title: string;
   url: string;
   icon?: string;
   children?: AdminMenuItem[];
}

export interface AdminMenuSection {
   title: string;
   items: AdminMenuItem[];
}

export interface AdminMenu {
   sections: AdminMenuSection[];
   bottomItems: AdminMenuItem[];
}
