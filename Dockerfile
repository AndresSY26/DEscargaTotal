# ---- Fase 1: Construcción (Build Stage) ----
FROM node:20-slim AS builder

# Instalar dependencias del sistema operativo
RUN apt-get update && apt-get install -y python3 python3-pip ffmpeg

# Instalar yt-dlp, añadiendo la bandera para evitar el error de PEP 668
RUN pip3 install -U yt-dlp --break-system-packages

# Establecer el directorio de trabajo
WORKDIR /app

# Instalar dependencias de Node.js
COPY package.json package-lock.json* ./
RUN npm ci

# Copiar el código fuente y construir la aplicación
COPY . .
RUN npm run build


# ---- Fase 2: Producción (Production Stage) ----
FROM node:20-slim AS runner
WORKDIR /app

# Instalar SOLO las dependencias de sistema necesarias para EJECUTAR
RUN apt-get update && apt-get install -y --no-install-recommends python3 python3-pip ffmpeg \
    # Instalar yt-dlp, añadiendo de nuevo la bandera --break-system-packages
    && pip3 install -U yt-dlp --break-system-packages \
    # Limpiar la caché
    && rm -rf /var/lib/apt/lists/*

# Crear un usuario no-root para seguridad
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar los archivos construidos desde la fase 'builder'
# Se eliminó la línea que copiaba /app/public porque no existe en este proyecto.
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Cambiar al usuario no-root
USER nextjs

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
