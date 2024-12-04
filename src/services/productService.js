import baseUrl from "@/apis/instance";

export const fetchAllCategory = async () => {
  const respones = await baseUrl.get("admin/category");

  return respones.data;
};

export const createProduct = async (product) => {
  const response = await baseUrl.post("admin/product", product);

  return response;
};

export const fetchProducts = async (size, page, search) => {
  const response = await baseUrl.get(
    `admin/product?size=${size}&page=${page}&search=${search}`
  );

  return response.data;
};
