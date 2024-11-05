import { safeParse , number, parse, string, transform, pipe } from "valibot"
import { DraftProductSchme, Product, ProductSchema, ProductsSchema } from "../types"
import axios from "axios"
import { toBoolean } from "../helpers"

type ProductData = {
    [k: string]: FormDataEntryValue
}

export async function addProduct(data: ProductData) {
    try {
        const result = safeParse(DraftProductSchme, {
            name: data.name,
            price: +data.price
        })
        
        if(result.success) {
            const url = `${import.meta.env.VITE_URL_API}/api/products`
            await axios.post(url, {
                name: result.output.name,
                price: result.output.price
            })
        } else{
            throw new Error('Datos no válidos')
        }

    } catch (error) {
        console.log(error)
    }
}

export async function getProducts() {
    try {
        const url = `${import.meta.env.VITE_URL_API}/api/products`
        const { data } = await axios.get(url)
        const result = safeParse(ProductsSchema, data.data)
        if (result.success) {
            return result.output
        } else {
            throw new Error('Hubo un error...')
        }

    } catch (error) {
        console.log(error)
    }
}

export async function getProductsByID(id: Product['id']) {
    try {
        const url = `${import.meta.env.VITE_URL_API}/api/products/${id}`
        const { data } = await axios.get(url)
        const result = safeParse(ProductSchema, data.data)
        if (result.success) {
            return result.output
        } else {
            throw new Error('Hubo un error...')
        }

    } catch (error) {
        console.log(error)
    }
    
}

export async function updateProduct(data: ProductData, id: Product['id']) {
    try {

        const NumberSchema = pipe(string(), transform(Number), number());

        const result = safeParse(ProductSchema, {
            id: id,
            name: data.name,
            price: parse(NumberSchema, data.price),
            availability: toBoolean(data.availability.toString())
        })

        if(result.success) {
            const url = `${import.meta.env.VITE_URL_API}/api/products/${id}`
            await axios.put(url, result.output)
        }
        console.log(result)
    } catch (error) {
        console.log(error)
        
    }
}

export async function deleteProduct(id: Product['id']) {
    try {
        const url = `${import.meta.env.VITE_URL_API}/api/products/${id}`
        await axios.delete(url)
    } catch (error) {
        
    }
}

export async function updateProductAvailability(id: Product['id']) {
    try {
        const url = `${import.meta.env.VITE_URL_API}/api/products/${id}`
        await axios.patch(url)
    } catch (error) {
        console.log(error)
    }
}