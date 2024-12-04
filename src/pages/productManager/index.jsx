import { useDebounce } from "@/hooks/useDebounce";
import {
  createProduct,
  fetchAllCategory,
  fetchProducts,
} from "@/services/productService";
import { CloseOutlined, ReloadOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Pagination,
  Select,
  Table,
} from "antd";
import React, { useEffect, useState } from "react";

export default function ProductManager() {
  const [form] = Form.useForm();
  const [isShowModal, setIsShowModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [searchValue, setSearchValue] = useState("");
  const [totalElements, setTotalElements] = useState(0);
  const [categoryId, setCategoryId] = useState(null);

  useEffect(() => {
    const getAllCategory = async () => {
      const response = await fetchAllCategory();

      setCategories(response);
    };

    getAllCategory();
  }, []);

  const debouceSearch = useDebounce(searchValue, 300);

  const fetchAllProduct = async () => {
    try {
      setIsLoading(true);
      const response = await fetchProducts(
        pageSize,
        currentPage,
        debouceSearch
      );
      console.log(response);

      setProducts(response.content);

      setTotalElements(response.totalElements);

      setIsLoading(false);
    } catch (error) {}
  };

  useEffect(() => {
    fetchAllProduct();
  }, [pageSize, currentPage, debouceSearch]);

  useEffect(() => {
    const getAllCategory = async () => {
      const response = await fetchAllCategory();

      setCategories(response);
    };

    getAllCategory();
  }, []);

  const handleChangePage = (page) => {
    console.log(page);

    setCurrentPage(page - 1);
  };

  const dataSource = products.map((pro) => {
    return {
      key: pro.id,
      name: pro.name,
      sku: pro.sku,
      status: pro.status ? "Active" : "Inactive",
    };
  });

  const columns = [
    {
      title: "Product name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Sku",
      dataIndex: "sku",
      key: "sku",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Action",
      render: () => (
        <div>
          <Button>Sửa</Button>
          <Button>Xóa</Button>
        </div>
      ),
    },
  ];

  const handleShowModal = () => {
    setIsShowModal(true);
  };

  const handleCloseModal = () => {
    setIsShowModal(false);
  };

  const handleChangeCategory = (value) => {
    setCategoryId(value);
  };

  const onFinish = async (product) => {
    // Gọi API thêm mới sản phẩmư
    const newProduct = { ...product, status: true };
    try {
      const response = await createProduct(newProduct);

      if (response.status === 201) {
        // Reset form
        form.resetFields();

        // load lại dữ liệu

        // Hiển thị thông báo
        message.success("Thêm sản phẩm thành công");

        // Đóng modal
        handleCloseModal();
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <>
      <Modal
        title={
          <div className="flex items-center justify-between mb-4">
            <h3>Add product</h3>
            <CloseOutlined onClick={handleCloseModal} />
          </div>
        }
        closeIcon={false}
        footer={false}
        open={isShowModal}
      >
        <Form
          form={form}
          layout="vertical"
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Product name"
            name="name"
            rules={[
              {
                required: true,
                message: "Product name is required",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Image"
            name="image"
            rules={[
              {
                required: true,
                message: "Image is required",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Category"
            name="categoryId"
            rules={[
              {
                required: true,
                message: "Category is required",
              },
            ]}
          >
            <Select
              placeholder="Select category"
              //   defaultValue="lucy"
              onChange={handleChangeCategory}
              options={categories?.content?.map((cat) => {
                return {
                  value: cat.id,
                  label: cat.categoryName,
                };
              })}
            />
          </Form.Item>

          <Form.Item label={null}>
            <div className="mt-4 flex justify-end gap-3">
              <Button
                onClick={handleCloseModal}
                type="default"
                htmlType="button"
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      <main>
        <div className="flex justify-between items-center mb-4">
          <h3>Product</h3>
          <Button onClick={handleShowModal} type="primary">
            Add product
          </Button>
        </div>
        <div className="flex justify-end gap-4 mb-4">
          <Input.Search
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
            className="w-[300px]"
          />
          <ReloadOutlined />
        </div>
        <div className="mb-4">
          <Table
            loading={isLoading}
            dataSource={dataSource}
            columns={columns}
            pagination={false}
          />
        </div>
        <div className="flex justify-end ">
          <Pagination
            onChange={handleChangePage}
            total={totalElements}
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} of ${total} items`
            }
            defaultPageSize={pageSize}
            defaultCurrent={currentPage}
          />
        </div>
      </main>
    </>
  );
}
