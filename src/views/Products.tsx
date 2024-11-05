import { ActionFunctionArgs, Link, useLoaderData } from "react-router-dom"
import { getProducts, updateProductAvailability } from "../services/ProductService"
import ProductDetails from "../components/ProductDetails"
import { Product } from "../types"


export async function loader( ){
    const products = await getProducts()
    return products
}

export async function action({ request }: ActionFunctionArgs) {
    const data = Object.fromEntries(await request.formData()) // el form entries me trae los datos del formulario
    await updateProductAvailability(+data.id)
    return {}
}

export default function Products() {

    const products = useLoaderData() as Product[] // Si llegamos a este punto entonces ya sabemos que está todo bien, para no hacer todo safeParse se hace esto

    return (
        <>
            <div className="flex justify-between">
                <h2 className=" text-4xl font-black text-slate-500">Productos</h2>
                <Link to="productos/nuevo" className="rounded-md bg-indigo-600 p-3 text-sm text-white shadow-sm hover:bg-indigo-500">
                    Agregar Producto
                </Link>
            </div>
            <div className="p-2">
                <table className="w-full mt-5 table-auto">
                    <thead className="bg-slate-800 text-white">
                        <tr>
                            <th className="p-2">Producto</th>
                            <th className="p-2">Precio</th>
                            <th className="p-2">Disponibilidad</th>
                            <th className="p-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        { products.map(product => (
                            <ProductDetails 
                                key = { product.id }
                                product = { product }
                            />
                        )) }
                    </tbody>
                </table>
            </div>
        </>
    )
}
