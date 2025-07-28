import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { Button, Card } from '../../ui';
import { FaShopify} from "react-icons/fa6";


import { FaAngleDoubleRight, FaAngleDoubleLeft } from "react-icons/fa";
import { GiShoppingCart } from "react-icons/gi";

import { Toaster, toast } from 'react-hot-toast'
import { ModalDetailProduct, ModalPayProduct } from '../modal';
import { useEffect, useMemo, useState } from 'react';
import { useProductContext } from '@/feature/contex/buyNotifications';

export const CustomPrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <FaAngleDoubleRight
    className={`${className} !text-primary-700`}
      style={{ ...style,  fontSize: '30px' }}
      onClick={onClick}
    />
  );
};

export const CustomNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <FaAngleDoubleLeft
    className={`${className} !text-primary-700`}
      style={{ ...style,  fontSize: '30px' }}
      onClick={onClick}
    />
  );
};


export interface Producto {
  id: number;
  descripcionProducto: string;
  stock: number;
  valorProducto: number;
  imagenProducto: string;
  categoriaProductoId: number;
  detalleProducto:string
  usuarioAdd: string;
  estado: number;
  fechaAdd: string;
 
}

interface CarruselHomeProps {
  Producto: Producto[];
}

export const CarruselHome:React.FC<CarruselHomeProps> = ({Producto}) => {
    

  const [idProducto, setIdProducto] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showModalBuy, setShowModalBuy] = useState(false)
  const [product, setProduct] = useState<Producto[]>([])
  const {  setTotalProductos ,setProductNotificacion, productNotificacion } = useProductContext();

  const productForId = Producto.find((item) => item.id === idProducto);

    const settings = {
        dots: true,  // Muestra los puntos de navegación
        infinite: Producto.length > 3,  // Permite el desplazamiento infinito
        speed: 500,  // Velocidad de transición
        slidesToShow: Math.min(3, Producto.length),  // Número de slides visibles
        slidesToScroll: 1,  // Número de slides que se desplazan
        autoplay: true,  // Activa el auto-slide
        autoplaySpeed: 3000,  // Tiempo entre cada slide
        prevArrow: <CustomNextArrow  />,
        nextArrow: <CustomPrevArrow  />,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: Math.min(2, Producto.length),
              slidesToScroll: 2,
              infinite: Producto.length > 2,
              dots: true
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              initialSlide: 1
            }
          }
        ]

      };

      const handleClick = (itemId: number) => {
        setIdProducto(itemId)
        setShowModal(true)

      }

   
     const totalProduct =  useMemo(() => 
        product.reduce((producaa, item) => producaa + item.valorProducto, 0)
        , [product])
 
        useEffect(() => {
          setTotalProductos(totalProduct);
        }, [totalProduct, setTotalProductos]);
     
    
      

      const handleBuy = (itemId: number) => {
        const itemToAdd = Producto.find((item) => item.id === itemId);
        if (!itemToAdd) return; 

        const alreadyInCart = productNotificacion.find((item) => item.id === itemToAdd.id);
     
        if(alreadyInCart) {
          toast.error('El producto ya está en el carrito', {
            icon: '❌',
          });
        }else {
          toast.success('🛒  Producto añadido al carrito', {
            icon: '✅', 
          });
           setProduct((prev) => [...prev, itemToAdd]);
           setProductNotificacion((prev) => [...prev, itemToAdd]);
           
        }
       
        
      }

  return (
    <> 
    <div className="w-11/12 mx-auto p-6 mt-5 mb-5">
  <Slider {...settings}>
    {Producto.length > 0 ? Producto.map((item) => (
      <Card 
        key={item.id} 
        className="w-full max-w-sm mx-auto flex flex-col justify-between rounded-xl border border-primary-700"
      >
        <div className="flex justify-center pt-4">
           <img src={item.imagenProducto} alt={item.descripcionProducto} className="w-72 h-48 object-cover rounded-md" /> 
        </div>

        <div className="text-center mt-3 px-4">
          <h1 className="text-lg font-semibold">{item.descripcionProducto}</h1>
          <p className="font-medium">{item.valorProducto}</p>
          <p onClick={() => handleClick(item.id)} className="cursor-pointer">
            Más información <span className="font-bold hover:underline">aquí</span>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-0 mt-4">
          <Button 
            type='button' 
            onClick={() => handleBuy(item.id)} 
            className="w-full bg-gradient-to-b from-[#a20f5c] to-[#d53287] rounded-tr-none rounded-br-none rounded-bl-lg rounded-tl-none  "
          >
            <GiShoppingCart />
            Añadir al carrito
          </Button>

          <Button 
            type='button' 
            onClick={() => setShowModalBuy(true)} 
            className="w-full bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-r   rounded-br-xl rounded-tl-none rounded-bl-none   "
          >
            <FaShopify />
            Comprar
          </Button>
        </div>
      </Card>
    )) : (
      <div className="flex justify-center items-center h-96 w-full">
        <h1 className="text-2xl font-bold text-primary-700 text-center">
          No hay productos disponibles
        </h1>
      </div>
    )}
  </Slider>
</div>
    <div>
      <ModalDetailProduct
      idProducto={idProducto}
        showModal={showModal} 
        onSucces={() => setShowModal(false)} 
        nombre={productForId?.descripcionProducto ?? ''}
        description={productForId?.detalleProducto ?? ''}
        valor={productForId?.valorProducto ?? 0}
        icon={productForId?.imagenProducto ?? ''} 
      />
    </div>
    <div>
    <ModalPayProduct
      showModal={showModalBuy} 
      onSucces={() => setShowModalBuy(false)}  
    />
    </div>
    <Toaster
      position="top-right"
      reverseOrder={true}
      toastOptions={{
        className: '',
        duration: 3000,
        style: {
          background: '#363636',
          color: '#fff',
        },
      }}
    />
    </>
  )}


