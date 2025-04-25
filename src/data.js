function generateUserData(count) {
    const users = [];
    const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'protonmail.com'];
    const cities = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barishal', 'Rangpur', 'Mymensingh'];
    
    // First user as admin
    users.push({
      name: 'admin',
      email: 'admin@gmail.com',
      password: 'e@12',
      phone: '018' + Math.floor(10000000 + Math.random() * 90000000),
      address: 'Feni, Bangladesh',
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
      isAdmin: true
    });
  
    // Generate remaining users
    for (let i = 1; i < count; i++) {
      const gender = Math.random() > 0.5 ? 'men' : 'women';
      const firstName = ['Yeasir', 'Ali', 'Rahim', 'Karim', 'Sadia', 'Fatima', 'Ayesha', 'Minhaz'][Math.floor(Math.random() * 8)];
      const lastName = ['Ahmed', 'Khan', 'Hossain', 'Islam', 'Rahman', 'Chowdhury', 'Akter', 'Begum'][Math.floor(Math.random() * 8)];
      const domain = domains[Math.floor(Math.random() * domains.length)];
      
      users.push({
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}${lastName.toLowerCase()}${i}@${domain}`,
        password: 'e@12',
        phone: '01' + [3,4,5,6,7,8,9][Math.floor(Math.random() * 7)] + Math.floor(10000000 + Math.random() * 90000000),
        address: `${cities[Math.floor(Math.random() * cities.length)]}, Bangladesh`,
        image: `https://randomuser.me/api/portraits/${gender}/${i+1}.jpg`,
        isAdmin: i < 3 // First 3 users after admin will be admins
      });
    }
  
    return users;
  }


  function generateDummyProducts(categories) {
    const products = [];
    
    // Product models for each category
    const categoryModels = {
      "Vivo Phone": ["Vivo V29", "Vivo Y27", "Vivo Y100", "Vivo T1"],
      "Huwaie Phone": ["Huawei P50", "Huawei Nova 11", "Huawei Mate 60"],
      "Nokia Phone": ["Nokia G42", "Nokia C32", "Nokia X30"],
      "Samsung Phone": ["Galaxy S23", "Galaxy A54", "Galaxy M34", "Galaxy F54"],
      "Oppo Phone": ["Oppo Reno 10", "Oppo A98", "Oppo F23"],
      "Smart Tv": ["Mi TV 32", "TCL 43P635", "Samsung CU7000", "LG UR80"],
      "LG freeze": ["LG 685L", "LG 885L", "LG 210L"],
      "Gree Ac": ["Gree 1.5 Ton", "Gree 2 Ton Inverter", "Gree 1 Ton"],
      "A4 Mouse": ["A4 Tech F5", "A4 Tech Bloody", "A4 Tech OP-720"],
      "A4 Keyboard": ["A4 Tech KB-8", "A4 Tech Bloody B120", "A4 Tech KR-85"],
      "HP Laptop": ["HP 15s", "HP Pavilion", "HP Victus"],
      "Apple Laptop": ["MacBook Air M1", "MacBook Pro M2", "MacBook Pro 16"]
    };
  
    // Price ranges for each category
    const priceRanges = {
      "Vivo Phone": [15000, 50000],
      "Huwaie Phone": [20000, 80000],
      "Nokia Phone": [10000, 35000],
      "Samsung Phone": [15000, 150000],
      "Oppo Phone": [12000, 45000],
      "Smart Tv": [20000, 250000],
      "LG freeze": [25000, 120000],
      "Gree Ac": [35000, 150000],
      "A4 Mouse": [500, 3000],
      "A4 Keyboard": [800, 5000],
      "HP Laptop": [40000, 250000],
      "Apple Laptop": [80000, 500000]
    };
  
    // Generate 10 products per category
    categories.forEach(category => {
      const models = categoryModels[category.name] || [`${category.name.split(' ')[0]} Model 1`];
      
      for (let i = 0; i < 10; i++) {
        const model = models[i % models.length] + (i > models.length - 1 ? ` ${Math.floor(i/models.length)+1}` : '');
        const name = `${category.name.split(' ')[0]} ${model}`;
        const [minPrice, maxPrice] = priceRanges[category.name] || [1000, 10000];
        const price = (Math.random() * (maxPrice - minPrice) + minPrice).toFixed(2);
        
        products.push({
          name,
          slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
          description: `Brand new ${name} with warranty. Best ${category.name} in Bangladesh.`,
          price: parseFloat(price),
          image: `https://example.com/products/${category.slug}/${name.toLowerCase().replace(/\s+/g, '-')}.jpg`,
          sold: Math.floor(Math.random() * 50),
          quantity: Math.floor(Math.random() * 100) + 20,
          shipping: Math.floor(Math.random() * 5),
          category: category._id,
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30))
        });
      }
    });
  
    return products;
  }
  
  // Your categories
  const categories = [
    {
        "_id": "680b55c0467af8448505110d",
        "name": "Vivo Phone",
        "slug": "vivo-phone"
    },
    {
        "_id": "680b55cf467af8448505110f",
        "name": "Huwaie Phone",
        "slug": "huwaie-phone"
    },
    {
        "_id": "680b55e5467af84485051111",
        "name": "Nokia Phone",
        "slug": "nokia-phone"
    },
    {
        "_id": "680b55fb467af84485051113",
        "name": "Samsung Phone",
        "slug": "samsung-phone"
    },
    {
        "_id": "680b5616467af84485051115",
        "name": "Oppo Phone",
        "slug": "oppo-phone"
    },
    {
        "_id": "680b5620467af84485051117",
        "name": "Smart Tv",
        "slug": "smart-tv"
    },
    {
        "_id": "680b562f467af84485051119",
        "name": "LG freeze",
        "slug": "lg-freeze"
    },
    {
        "_id": "680b563d467af8448505111b",
        "name": "Gree Ac",
        "slug": "gree-ac"
    },
    {
        "_id": "680b5654467af8448505111d",
        "name": "A4 Mouse",
        "slug": "a4-mouse"
    },
    {
        "_id": "680b565c467af8448505111f",
        "name": "A4 Keyboard",
        "slug": "a4-keyboard"
    },
    {
        "_id": "680b566d467af84485051121",
        "name": "HP Laptop",
        "slug": "hp-laptop"
    },
    {
        "_id": "680b5687467af84485051123",
        "name": "Apple Laptop",
        "slug": "apple-laptop"
    }
];
  
  // Generate 120 products (10 per category)

  

const data = {
    users: generateUserData(100),

    products: generateDummyProducts(categories)
    
}



  // Generate 100 users
//   const userData = 
//   console.log(userData);


/* 





Samsung Galaxy A20
*/

module.exports = data;