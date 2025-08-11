# ---- Fase 1: Construcción (Build Stage) ----
# Aquí se instalan todas las dependencias (de desarrollo y de sistema)
# y se construye la aplicación de Next.js.

# 1. Usar una imagen oficial de Node.js como base.
FROM node:20-slim AS builder

# 2. Instalar dependencias del sistema operativo: Python, Pip y FFmpeg
RUN apt-get update && apt-get install -y python3 python3-pip ffmpeg

# 3. Instalar yt-dlp usando pip (la 'U' lo actualiza si ya existe)
RUN pip3 install -U yt-dlp

# 4. Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# 5. Copiar los archivos de manifiesto de dependencias
COPY package.json package-lock.json* ./

# 6. Instalar las dependencias de Node.js de forma optimizada para CI/CD
RUN npm ci

# 7. Copiar el resto del código fuente de la aplicación
COPY . .

# 8. Construir la aplicación para producción
RUN npm run build


# ---- Fase 2: Producción (Production Stage) ----
# Aquí se crea la imagen final, que es más ligera. Solo contendrá lo
# estrictamente necesario para ejecutar la aplicación construida.

# 1. Usar una imagen base de Node.js ligera para la versión final
FROM node:20-slim AS runner

# 2. Establecer el directorio de trabajo
WORKDIR /app

# 3. Instalar SOLO las dependencias de sistema necesarias para la EJECUCIÓN:
#    Python (para yt-dlp), Pip (para instalar yt-dlp), y FFmpeg (para procesar).
#    --no-install-recommends evita instalar paquetes opcionales para una imagen más pequeña.
RUN apt-get update && apt-get install -y --no-install-recommends python3 python3-pip ffmpeg \
    # Instalar yt-dlp usando pip
    && pip3 install -U yt-dlp \
    # Limpiar la caché de apt para reducir el tamaño final de la imagen
    && rm -rf /var/lib/apt/lists/*

# 4. Crear un grupo y un usuario no-root para correr la aplicación de forma segura
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 5. Copiar los artefactos construidos desde la fase 'builder'
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# 6. Cambiar al usuario no-root
USER nextjs

# 7. Exponer el puerto en el que Next.js corre por defecto
EXPOSE 3000

# 8. El comando que se ejecutará para iniciar la aplicación
# Usa 'npm start', que Next.js define automáticamente para producción.
CMD ["npm", "start"]