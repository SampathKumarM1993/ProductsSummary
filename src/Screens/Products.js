import React, { useState, useEffect } from "react";
import './Product.css';
import axios from 'axios';
import { Table, Pagination, Row, Col, Image, Typography, Layout, Menu, Modal, Form, Input, Button } from 'antd';
import { DashboardOutlined, ShoppingOutlined, DollarOutlined } from '@ant-design/icons';
import logo from '../Assests/hamburger-menu.svg'
const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const Products = () => {

  const [page, setPage] = useState(0); 
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); 

  // Fetch products from API
  const fetchProducts = async (limit, skip) => {
    try { 
      const response = await axios.get(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`);
      setProducts(response.data.products);
      setTotalProducts(response.data.total);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  // On initial load and when page or rowsPerPage changes

  useEffect(() => {  
    fetchProducts(5, 0);
  }, []); 

  // Handle page change
  const handlePageChange = (newPage, newPageSize) => {  
    setPage(newPage);
    setPageSize(newPageSize || pageSize);
    fetchProducts(newPageSize, (newPage - 1)  * newPageSize);
  };

  // Open modal when title is clicked
  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  // Close modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedProduct(null);
  };

  // Handle form submission
  const handleFormSubmit = (values) => {
    const updatedProducts = products.map((product) =>
      product.id === selectedProduct.id
        ? { ...product, price: values.price, title: values.title, stock: values.stock } // For updating the grid value on Form submit
        : product
    );
    setProducts(updatedProducts); 
    setIsModalVisible(false);
    setSelectedProduct(null);
  };

  // Define table columns
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title', 
      render: (text, record) => (
        <a onClick={() => openModal(record)}>{text}</a>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
    },
    {
      title: 'Availability Status',
      dataIndex: 'stock',
      render: (stock) => (stock > 0 ? 'In Stock' : 'Out of Stock'),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      render: (price) => `$${price}`,
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
    },
    {
      title: 'Thumbnail',
      dataIndex: 'thumbnail',
      render: (thumbnail, record) => (
        <Image
          width={50}
          height={50}
          src={thumbnail}
          alt={record.title}
          style={{ objectFit: 'cover' }}
        />
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}> 
      <Sider style={{ background: '#fff', textAlign: 'Start'}}>
        <div style={{ textAlign: 'start', padding: '20px' }}>
            <img src={logo} alt="Logo" style={{ width: '25px', height: 'auto' }} />  
        </div>
        <Menu theme="light" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" icon={<DashboardOutlined />}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="2" icon={<ShoppingOutlined />}>
            Products
          </Menu.Item>
          <Menu.Item key="3" icon={<DollarOutlined />}>
            Pricing
          </Menu.Item> 
        </Menu>
      </Sider>
 
      <Layout>
        <Header style={{ background: '#fff', padding: 0, textIndent: '0.5rem'}}>
          <Title className = "screenHeader" level={2}>Product Summary</Title>
        </Header>

        <Content style={{ margin: '16px' }}>
          <div style={{ padding: '24px', background: '#fff', minHeight: '360px' }}>
            <Table
              dataSource={products}
              columns={columns}
              pagination={false}
              rowKey={(record) => record.id}
              rowClassName={() => 'rowSize'} 
            />

            <Row justify="center" style={{ marginTop: '20px' }}>
              <Col>
                <Pagination
                  current={page}
                  pageSize={pageSize}
                  total={totalProducts}
                  onChange={handlePageChange}
                  showSizeChanger
                  pageSizeOptions={[5, 10, 20, 50]}
                  onShowSizeChange={handlePageChange}
                />
              </Col>
            </Row>
          </div>
        </Content>
      </Layout>
      {selectedProduct && (
        <Modal
          title={`Product Details: ${selectedProduct.title}`}
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <Form
            layout="vertical"
            onFinish={handleFormSubmit}
            initialValues={{
              title: selectedProduct.title,
              price: selectedProduct.price,
              stock: selectedProduct.stock,
            }}
          >
            <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please input the title!' }]}>
              <Input />
            </Form.Item>

            <Form.Item label="Price" name="price" rules={[{ required: true, message: 'Please input the price!' }]}>
              <Input type="number" />
            </Form.Item>

            <Form.Item label="Stock" name="stock" rules={[{ required: true, message: 'Please input the stock!' }]}>
              <Input type="number" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </Layout> 
  );
};

export default Products;