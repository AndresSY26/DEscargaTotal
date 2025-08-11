# ---- Fase de Construcción (Build Stage) ----

# 1. Usar una imagen oficial de Node.js como base.
FROM node:20-slim AS builder

# 2. Instalar las dependencias del sistema operativo que necesitamos
# - python3 y pip para poder instalar yt-dlp
# - ffmpeg para procesar audio y video
RUN apt-get update && apt-get install -y python3 python3-pip ffmpeg

# 3. Instalar yt-dlp usando pip
RUN pip3 install -U yt-dlp

# 4. Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# 5. Copiar los archivos de dependencias de Node.js
COPY package.json package-lock.json ./

# 6. Instalar las dependencias de Node.js
RUN npm ci

# 7. Copiar el resto del código de la aplicación
COPY . .

# 8. Construir la aplicación de Next.js para producción
RUN npm run build

# ---- Fase de Producción (Production Stage) ----

# 1. Usar una imagen más ligera para la versión final
FROM node:20-slim AS runner
WORKDIR /app

# 2. Instalar SOLO las dependencias de sistema necesarias para correr la app
RUN apt-get update && apt-get install -y --no-install-recommends python3 ffmpeg \
    # Instalar yt-dlp de forma eficiente
    && pip3 install -U yt-dlp \
    # Limpiar la caché para reducir el tamaño de la imagen
    && rm -rf /var/lib/apt/lists/*

# 3. Crear un usuario no-root para mejorar la seguridad
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 4. Copiar los archivos de la app construida desde la fase anterior
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# 5. Cambiar el propietario de los archivos al nuevo usuario
RUN chown -R nextjs:nodejs /app/.next

# 6. Cambiar al usuario no-root
USER nextjs

# 7. Exponer el puerto en el que corre la aplicación (Next.js usa el 3000 por defecto)
EXPOSE 3000

# 8. El comando para iniciar la aplicación
CMD ["npm", "start"]