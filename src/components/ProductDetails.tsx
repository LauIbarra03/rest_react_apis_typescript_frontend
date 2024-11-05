import { ActionFunctionArgs, Form, useNavigate, redirect, useFetcher } from "react-router-dom"
import { formatCurrency } from "../helpers"
import { Product } from "../types"
import { deleteProduct } from "../services/ProductService"

type ProductDetailsProps = {
    product: Product
}

export async function action({ params }: ActionFunctionArgs) {

    if(params.id !== undefined) {
        await deleteProduct(+params.id)
        return redirect('/')
    }
    
    
}

export default function ProductDetails({ product }: ProductDetailsProps) {

    const fetcher = useFetcher() // fetcher es para hacer las interacciones pero sin tener q redirigir
    const isAvailable = product.availability
    const navigate = useNavigate()

    return (
        <tr className="border-b ">
            <td className="p-3 text-lg text-gray-800">
                { product.name }
            </td>
            <td className="p-3 text-lg text-gray-800">
                { formatCurrency(product.price) }
            </td>
            <td className="p-3 text-lg text-gray-800">
                <fetcher.Form method="POST"> {/* CON EL FETCHER PUEDO CONECTAR CORRECTAMENTE CON REACT-ROUTER-DOM*/}
                    <button 
                        type="submit" 
                        name="id" 
                        value={product.id} 
                        className={`${isAvailable ? 'text-black' : 'text-red-600'} rounded-lg p-2 text-xs uppercase font-bold w-full border border-black-100 hover:cursor-pointer`}    
                    >
                        { isAvailable ? 'Disponible' : 'No disponible'}
                    </button>
                    {/* Este es una forma para conseguir el id, pero acá se lo puedo pasar en el name y el value */}
                    {/* <input type="hidden" name="id" /> */}
                </fetcher.Form>
            </td>
            <td className="p-3 text-lg text-gray-800 ">
                <div className="flex gap-2 items-center">
                    <button onClick={() => navigate(`productos/${product.id}/editar`/* , { // Forma de editar internamente
                        state: {
                            product: product
                        }
                    }*/)} 
                        className="bg-indigo-600 text-white rounded-lg w-full p-2 uppercase font-bold text-xs text-center hover:bg-indigo-500 hover:cursor-pointer"
                    >Editar
                    </button>
                    <Form
                        className="w-full"
                        method="POST"
                        // usando el action en el componente, tiene que corresponder con lo que defina en el router
                        action={`productos/${product.id}/eliminar`}
                        onSubmit={(e) => { // Se ejecuta antes que el action
                            if(!confirm('Eliminar')){
                                e.preventDefault()
                            }
                        }} 
                    >
                        <input
                            type="submit"
                            value="Eliminar"
                            className="bg-red-600 text-white rounded-lg w-full p-2 uppercase font-bold text-xs text-center hover:bg-red-500 hover:cursor-pointer"
                        />
                    </Form>
                </div>
            </td>
        </tr> 
    )
}
