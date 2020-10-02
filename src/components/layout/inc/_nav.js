export default [
    {
        _name: 'CSidebarNav',
        _children: [
            {
                _name: 'CSidebarNavItem',
                name: 'Dashboard',
                to: '/dashboard',
                icon: 'cil-home',
            },
            {
                _name: 'CSidebarNavDropdown',
                name: 'Product',
                route: '/product',
                icon: 'cil-cart',
                items: [
                    {
                        name: 'Brand',
                        to: '/product/brand'
                    },
                    {
                        name: 'Category',
                        to: '/product/category'
                    },
                    {
                        name: 'Subcategory',
                        to: '/product/sub-category'
                    },
                    {
                        name: 'Sub Subcategory',
                        to: '/product/sub-subcategory'
                    },
                    {
                        name: 'Properties',
                        to: '/product/properties'
                    },
                    {
                        name: 'In House Products',
                        to: '/product/product-admin'
                    },
                    {
                        name: 'Products Group',
                        to: '/product/product-group'
                    }

                ]
            },
            {
                _name: 'CSidebarNavDropdown',
                name: 'Region',
                route: '/region',
                icon: 'cil-map',
                items: [
                    {
                        name: 'Country',
                        to: '/region/country'
                    },
                    {
                        name: 'Division',
                        to: '/region/division'
                    },
                    {
                        name: 'City',
                        to: '/region/city'
                    },
                    {
                        name: 'Area',
                        to: '/region/area'
                    }
                ]
            },
            {
                _name: 'CSidebarNavDropdown',
                name: 'User',
                route: '/user',
                icon: 'cil-user-plus',
                items: [
                    {
                        name: 'User List',
                        to: '/user/user-list'
                    }
                ]
            },
            {
                _name: 'CSidebarNavDropdown',
                name: 'Frontend Settings',
                route: '/frontend',
                icon: 'cil-screen-desktop',
                items: [
                    {
                        name: 'General Settings',
                        to: '/frontend/general-settings'
                    },
                    {
                        name: 'Logo Settings',
                        to: '/frontend/logo'
                    }
                ]
            },
            {
                _name: 'CSidebarNavDropdown',
                name: 'E-commerce Setup',
                route: '/upload-manage',
                icon: 'cil-settings',
                items: [
                    {
                        name: 'Color',
                        to: '/upload-manage/color'
                    },
                    {
                        name: 'Attribute',
                        to: '/upload-manage/attribute'
                    },
                    {
                        name: 'Unit',
                        to: '/upload-manage/unit'
                    },
                    {
                        name: 'Business Type',
                        to: '/upload-manage/business-type'
                    },
                    {
                        name: 'Currency',
                        to: '/upload-manage/currency'
                    },
                ]
            }
        ]
    }
]
