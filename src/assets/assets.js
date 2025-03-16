import logo1 from './logo1.png'
import search from './search.png'
import user from './user.png'
import img1 from './img1.jpg'
import img2 from './img2.jpg'
import img3 from './img3.jpg'
import img4 from './img4.jpg'
import img5 from './img5.jpg'
import img6 from './img6.jpg'
import img7 from './img7.jpg'
import img8 from './img8.jpg'
import img9 from './img9.jpg'
import img10 from './img10.jpg'
import cart from './cart.png'
import menu from './menu.png'
import dropdown from './dropdown.png'
import taille from './taille.jpg'

export const assets ={
    taille,
    logo1,
    user,
    dropdown,
    menu,
    search,
    cart,
    img1,
    img2,
    img3,
    img4,
    img5,
    img6, 
    img7,
    img8,
    img9,
    img10,
}
export const products = [
    {
        _id: "aaaaa",
        name: "Women top",
        description: "A blabla",
        price: 4000,
        image: [img1],
        category: "Femmes",
        subCategory: "Topwear",
        sizes: ["S", "M", "L", "XL"],
        date: 1716634345448,
        color: ['red','black','blue'],
        atelier:'Courva',
        bestseller: true
    },
    {
        _id: "aaaab",
        name: "Women top",
        description: "A blabla",
        price: 4000,
        image: [img10,img9,img8],
        category: "Femmes",
        subCategory: "Topwear",
        sizes: ["S", "M", "L", "XL"],
        date: 1716634345448,
        atelier:'Mo Neat',
        color: ['red','black','blue'],
        bestseller: true
    },
    {
        _id: "aaaab",
        name: "Women top",
        description: "A blabla",
        price: 4000,
        image: [img6,img5,img7],  
        category: "Femmes",
        subCategory: "Topwear",
        sizes: ["S", "M", "L", "XL"],
        date: 1716634345448,
        atelier: 'Rayma',
        color: ['red','black','blue'],
        bestseller: false
    },
]