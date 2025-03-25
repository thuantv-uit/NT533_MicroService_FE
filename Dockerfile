# Sử dụng image Node.js chính thức làm base image
FROM node:20

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép file package.json và package-lock.json (nếu có)
COPY package.json ./

# Cài đặt các dependencies
RUN npm install

# Sao chép toàn bộ source code vào container
COPY . .

# Mở port mà ứng dụng sẽ chạy
EXPOSE 3000

# Lệnh để chạy ứng dụng
CMD ["npm", "start"]