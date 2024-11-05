import { createBrowserRouter } from 'react-router-dom'
import Layout from './layouts/Layout'
import Products, { action as updateAvailabilityAction, loader as productsLoader } from './views/Products'
import NewProduct, {action as newProdcutAction} from './views/NewProduct'
import EditProduct, { loader as editProductLoader, action as editProductAction } from './views/EditProduct'
import { action as deleteProductAction} from './components/ProductDetails'


export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [ // Le indico que páginas son hijas de este layout
            {
                index: true,
                element: <Products />,
                // los Loaders es para obtener los datos de una API de una forma mejor, similar a useEffect y colocar la respuesta en un state
                loader: productsLoader,
                action: updateAvailabilityAction
            },
            {
                path: 'productos/nuevo',
                element: <NewProduct />,
                action: newProdcutAction
            },
            {
                path: 'productos/:id/editar', // ROA Pattern - Resource-oriented design
                element: <EditProduct />,
                loader: editProductLoader,
                action: editProductAction
            },
            {
                path: 'productos/:id/eliminar',
                action: deleteProductAction
            }
        ]
    },
    // { // Ejemplo de layout
    //     path: '/ecommerce',
    //     element: <LayoutEcommerce/>
    // }
])
