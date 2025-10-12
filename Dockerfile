# 빌드 단계
FROM node:18-alpine AS build
WORKDIR /app
ADD . .
RUN yarn install
RUN yarn run build

# 배포 단계
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
