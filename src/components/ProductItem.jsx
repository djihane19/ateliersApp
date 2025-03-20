import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const ProductItem = ({id,image,name,price,atelier}) => {
    const {currency} = useContext(ShopContext);
    
  return (
    <Link className='text-gray-700 cursor-pointer' to={`/product/${id}`}>
        <div className='overflow-hidden' dir='rtl'>
            <img className='hover:scale-110 transition ease-in-out w-full h-48 object-cover rounded-lg' src={image[0]} alt="" />
            <p className='pt-3 pb-1 text-sm text-gray-500 font-medium'><i>{atelier}</i></p>
            <p className=' pb-1 text-sm'>{name}</p>
            <p  className='text-sm font-medium'>{price}{currency}</p>

        </div>
        


    </Link>
  )
}

export default ProductItem