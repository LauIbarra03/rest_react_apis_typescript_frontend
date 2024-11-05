// Todo lo que está comentado es una forma de hacer el edit, el problema es que el state, donde consigo los valores para el formulario 
// se genera cuando apreto el boton el pructo details, esto es malo si quiero compartir la URL

import { Link, Form, useActionData, ActionFunctionArgs, redirect, /* , useLocation*/ 
LoaderFunctionArgs,
useLoaderData} from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";
import { getProductsByID, updateProduct } from "../services/ProductService";
import { Product } from "../types";
import ProductForm from "../components/ProductForm";

// De esta forma consigo el id deade la URL y no en el state -> mucho mejor apoyarse en la URL
export async function loader({ params }: LoaderFunctionArgs) { // así consigo los query params
    
    if(params.id !== undefined){
        const product = await getProductsByID(+params.id)
        if(!product){
            // throw new Response('', { status: 404, statusText: 'Producto no encontrado' }) // -> Para devolver un 404
            return redirect('/')

        }
        return product
    }
}

export async function action({ request, params }: ActionFunctionArgs) {
    const data = Object.fromEntries(await request.formData())
    let error = ''
    if (Object.values(data).includes('')) {
        error = 'Todos los campos son obligatorios'
    }

    if (error.length) {
        return error
    }

    // el await es como un semaforo para bloquear
    if(params.id !== undefined){
        await updateProduct(data, +params.id)

        return redirect('/')
    }

}

const availabilityOptions = [
    { name: 'Disponible', value: true},
    { name: 'No Disponible', value: false}
 ]


export default function EditProduct() {
    const product = useLoaderData() as Product
    const error = useActionData() as string
    // const { state } = useLocation()

    return (
        <>
            <div className="flex justify-between">
                <h2 className=" text-4xl font-black text-slate-500">Editar Producto</h2>
                <Link to="/" className="rounded-md bg-indigo-600 p-3 text-sm text-white shadow-sm hover:bg-indigo-500">
                    Volver a Productos
                </Link>
            </div>
            { error && <ErrorMessage>{ error }</ErrorMessage> }
            {/* NO CREO UN COMPONENTE PARA EL FORMULARIO PARA TENER ESTE FORM Y EL INPUT POR SEPARADO, YA QUE USAN ACTIONS DISTINTOS Y VALUES TMB DIFERENTES*/}
            <Form className="mt-10" method="POST" >
                <ProductForm 
                    product = { product }
                />
                <div className="mb-4">
                    <label
                        className="text-gray-800"
                        htmlFor="availability"
                    >Disponibilidad:</label>
                    <select 
                        id="availability"
                        className="mt-2 block w-full p-3 bg-gray-50"
                        name="availability"
                        defaultValue={product?.availability.toString()}
                    >
                        {availabilityOptions.map(option => (
                        <option key={option.name} value={option.value.toString()}>{option.name}</option>
                        ))}
                    </select>
                </div>
                <input
                    type="submit"
                    className="mt-5 w-full bg-indigo-600 p-2 text-white font-bold text-lg cursor-pointer rounded"
                    value="Guardar Cambios"
                />
                
            </Form>
        </>
    )
}
