# Olla Cloud — static marketing site
# Stage 1: run the Hygraph blog generator (Node 20 has native fetch, no npm install needed)
# Stage 2: serve all files with nginx

# ── Stage 1: generate blog pages ────────────────────────────
FROM node:20-alpine AS generator
WORKDIR /app

# Copy everything so the script can read templates and write into posts/
COPY . .
# videos.json is manually maintained — merged with Hygraph articles at build time

# Pull posts from Hygraph and write posts/[slug].html + posts-data.js
RUN node generate-blog.js

# ── Stage 2: serve with nginx ────────────────────────────────
FROM nginx:1.27-alpine

# Replace the stock server config with ours
RUN rm /etc/nginx/conf.d/default.conf
COPY default.conf /etc/nginx/conf.d/default.conf

# Copy all site files from the generator stage
COPY --from=generator --chmod=644 /app/index.html /app/product.html /app/pricing.html \
     /app/resources.html /app/company.html /app/booking.html \
     /app/privacy.html /app/solutions.html \
     /app/styles.css /app/main.js /app/chatbot.js /app/cookie.js /app/posts-data.js \
     /usr/share/nginx/html/

COPY --from=generator --chmod=644 /app/ollacloudhero.html /usr/share/nginx/html/ollacloudhero.html

COPY --from=generator --chmod=644 /app/images/    /usr/share/nginx/html/images/
COPY --from=generator --chmod=644 /app/posts/     /usr/share/nginx/html/posts/
COPY --from=generator --chmod=644 /app/resources/ /usr/share/nginx/html/resources/

# Normalize ownership + perms
RUN chown -R root:root /usr/share/nginx/html \
 && find /usr/share/nginx/html -type d -exec chmod 755 {} + \
 && find /usr/share/nginx/html -type f -exec chmod 644 {} +

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -qO- http://127.0.0.1/healthz || exit 1
