const products = [
    {
      id: '001',
      name: 'T-Shirt',
      category:'Top',
      description: 'Comfortable cotton t-shirt',
      price: 19.99,
      image:'https://img.ssensemedia.com/images/b_white,g_center,f_auto,q_auto:best/232359F110010_1/the-row-white-wesler-t-shirt.jpg',
      variants: [
        {
          color: 'Black',
          size: 'M',
          stock: 0,
        },
        {
          color: 'White',
          size: 'M',
          stock: 120,
        },
      ]
    
    },
    {
      id: '002',
      name: ' Denim Jeans',
      category:'Jeans',
      description: 'Classic denim jeans',
      price: 49.99,
      image:'https://img.ssensemedia.com/images/b_white,g_center,f_auto,q_auto:best/222966F069001_1/grlfrnd-blue-brooklyn-jeans.jpg',
      variants: [
        {
          color: 'Grey',
          size: 'M',
          stock: 0,
        },
        {
          color: 'White',
          size: 'L',
          stock: 200,
        },
      ],
    

    },
    // Add more test product data as needed
  ];
 

  const productsWithTotalStock = products.map(product => {
    if (product.variants) {
      const totalStock = product.variants.reduce((total, variant) => total + variant.stock, 0);
      return { ...product, totalStock };
     
    } else {
      return product;
    }
  });
  console.log(productsWithTotalStock);

  export default productsWithTotalStock;

