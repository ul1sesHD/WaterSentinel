# =========================================
# 2. ENTENDIMIENTO DE LOS DATOS
# =========================================

# -----------------------------------------
# 2.1 Carga de librerías
# -----------------------------------------
library(dplyr)
library(ggplot2)
library(tidyr)
library(lubridate)

# -----------------------------------------
# 2.2 Carga del dataset
# -----------------------------------------
df <- as.data.frame(read.csv("C:\\Users\\alero\\Downloads\\Uni\\Semestre 8\\ANALÍTICA Y CIENCIA DE GRANDES VOLÚMENES DE DATOS\\practica_red_electrica_dirty.csv"))

# Vista inicial
head(df)

# -----------------------------------------
# 2.2.1 Descripción general del dataset
# -----------------------------------------
cat("Dimensiones:", nrow(df), "filas x",ncol(df), "columnas\n\n")

cat("Nombre de las columnas:\n")
print(names(df))

cat("\nClase por columna:\n")
print(sapply(df,class))

# Resumen general
summary(df)

# -----------------------------------------
# 2.2.2 Exploración de variables
# -----------------------------------------

# --- Exploración de consumo ---
head(df$consumo_mw,20)

unique(df$consumo_mw)[1:30]

# Detectar valores con texto (ej. "MW")
grep("MW",df$consumo_mw, value = TRUE)[1:20]

# Detectar valores no numéricos
grep("[^0-9.]",df$consumo_mw, value = TRUE)[1:20]

# --- Exploración de fechas ---
head(df$fecha,20)
unique(df$fecha)[1:20]

# --- Variables categóricas ---
table(df$subestacion)
table(df$region)
table(df$tipo_red)

# Cantidad de valores únicos
n_distinct(df$subestacion)
n_distinct(df$region)
n_distinct(df$tipo_red)

# --- Detección de espacios en blanco ---
grep("^\\s|\\s$", df$region, value = TRUE)[1:20]
grep("^\\s|\\s$", df$tipo_red, value = TRUE)[1:20]

# -----------------------------------------
# 2.2.3 Calidad de los datos
# -----------------------------------------

# Nulos
cat("\nNulos por columna:\n")
print(sapply(df, function(x) sum(is.na(x))))

# Duplicados
cat("\nDuplicados:\n")
sum(duplicated(df))

# Conversión tentativa para detectar errores
consumo_test <- as.numeric(df$consumo_mw)
head(consumo_test)
summary(consumo_test)

# -----------------------------------------
# 2.2.4 Visualización de datos
# -----------------------------------------

# --- Distribuciones ---

# Consumo
ggplot(df, aes(x= consumo_mw)) + 
  geom_bar(fill="pink") +
  theme_minimal() +
  labs(title = "Distribución del consumo")

# Región
ggplot(df, aes(x= region)) + 
  geom_bar(fill="pink") +
  theme_minimal() +
  labs(title = "Distribución de región")

# Fecha
ggplot(df, aes(x= fecha)) + 
  geom_bar(fill="pink") +
  theme_minimal() +
  theme(axis.text.x = element_text(angle = 90)) +
  labs(title = "Distribución de resgistros por fecha")

# Fecha
ggplot(df, aes(x= subestacion)) +
  geom_bar(fill="pink") +
  theme_minimal() +
  theme(axis.text.x = element_text(angle = 90)) +
  labs(title = "Distribución de subestación") 

# Tipo de red
ggplot(df, aes(x= tipo_red)) +
  geom_bar(fill="pink") +
  theme_minimal() +
  labs(title = "Distribución del tipo de red")

# -----------------------------------------
# Relaciones entre variables
# -----------------------------------------

# Región vs consumo
ggplot(df, aes(x = region, y = consumo_test)) +
  geom_point(alpha = 0.3) +
  geom_smooth(method = "loess", color = "red") +
  theme_minimal() +
  labs(title = "Relación entre región y consumo eléctrico",
       x = "Región",
       y = "Consumo")

# Tipo de red vs consumo
ggplot(df, aes(x = tipo_red, y = consumo_test)) +
  geom_point(alpha = 0.3) +
  geom_smooth(method = "loess", color = "red") +
  theme_minimal() +
  labs(title = "Relación entre tipo de red y consumo eléctrico")

# Subestación vs consumo
ggplot(df, aes(x = subestacion, y = consumo_test)) +
  geom_point(alpha = 0.3) +
  theme_minimal() +
  theme(axis.text.x = element_text(angle = 90)) +
  labs(title = "Relación entre subestación y consumo eléctrico")

# Fecha vs consumo
ggplot(df, aes(x = fecha, y = consumo_test)) +
  geom_point(alpha = 0.3) +
  geom_smooth(method = "loess", color = "red") +
  theme_minimal() +
  theme(axis.text.x = element_text(angle = 90)) +
  labs(title = "Relación entre fecha y consumo eléctrico")

# ================================
dfR <- read.csv("C:/Users/carpi/Downloads/R-JD/Practica 3/practica_red_electrica_dirty.csv")
print(sapply(dfR, class))
cat("Dimensiones:", nrow(dfR), "filas x", ncol(dfw), "columnas\n\n")

dfR$region <- trimws(dfR$region)
dfR$tipo_red <- trimws(dfR$tipo_red)
dfR$subestacion <- trimws(dfR$subestacion)
dfR$fecha <- trimws(dfR$fecha)
dfR$consumo_mw <- trimws(dfR$consumo_mw)

dfR$region[dfR$region == ""] <- NA
dfR$tipo_red[dfR$tipo_red == ""] <- NA
dfR$subestacion[dfR$subestacion == ""] <- NA
dfR$tipo_red[dfR$tipo_red == ""] <- NA
dfR$consumo_mw[dfR$consumo_mw == ""] <- NA

print(sapply(dfR, function(x) sum(is.na(x))))

# ================================Preparación de los datos
dfR <- read.csv("C:/Users/carpi/Downloads/R-JD/Practica 3/practica_red_electrica_dirty.csv")
#Limpieza de campos string.
  #Quitando espaciossss
dfR$region <- trimws(dfR$region)
dfR$tipo_red <- trimws(dfR$tipo_red)
dfR$subestacion <- trimws(dfR$subestacion)
dfR$fecha <- trimws(dfR$fecha)
dfR$consumo_mw <- trimws(dfR$consumo_mw)

#Corrección de tipos de datos.
dfR$consumo_mw <- as.numeric(gsub("[^0-9.]", "", dfR$consumo_mw))
dfR$consumo_mw <- as.numeric(dfR$consumo_mw)

dfR$fecha <- as.Date(dfR$fecha, format = "%Y-%m-%d")
str(dfR$fecha)
str(dfR$subestacion)

print(sapply(dfR, function(x) sum(is.na(x))))

#Imputación de valores faltantes.
dfR$region[dfR$region == ""] <- "Desconocido"
dfR$tipo_red[dfR$tipo_red == ""] <- "Desconocido"
dfR$subestacion[dfR$subestacion == ""] <- "Desconocido"
dfR$tipo_red[dfR$tipo_red == ""] <- "Desconocido"

dfR$consumo_mw[is.na(dfR$consumo_mw)] <- median(dfR$consumo_mw, na.rm = TRUE)

print(sapply(dfR, function(x) sum(is.na(x))))

library(dplyr)
library(ggplot2)
library(tidyr)
ggplot(dfR, aes(y = consumo_mw)) +
  geom_boxplot(na.rm = TRUE)+
  geom_boxplot(fill = "purple", color = "gray30") +
  labs(title = "Original con outliers Boxplot de consumo_mw", x = "", y = "consumo_mwht") +
  theme_minimal()




#Correlación
#Heatmat
library(dplyr)
library(tidyr)
library(ggplot2)
unique(dfR$region)
unique(dfR$tipo_red)
unique(dfR$subestacion)

df_num <- dfR
(df_num$region <- factor(df_num$region, 
                                              levels = c(1,2,3,4), 
                                              labels = c("Desconocido",
                                                         "Centro",
                                                         "Norte",
                                                         "Sur"
                                              )))

(df_num$tipo_red <- factor(df_num$tipo_red, 
                         levels = c(1,2,3,4), 
                         labels = c("Desconocido",
                                    "Baja",
                                    "Media",
                                    "Alta"
                         )))


(df_num$subestacion <- factor(df_num$subestacion, 
                           levels = c(1,2,3,4), 
                           labels = c("Desconocido",
                                      "NORTE_01",
                                      "CENTRO_02",
                                      "SUR_03"
                           )))

df_num <- df_num %>%
  select(where(is.numeric))

tc <- cor(df_num, use = "pairwise.complete.obs")

corrplot::corrplot(tc, method = "color", type = "full",
                   tl.cex = 0.7, number.cex = 0.6, mar = c(0,0,1,0),
                   title = "Matriz de correlaci?n")

heatmap(tc,
        symm = TRUE,
        main = "Matriz de correlaci?n (base R, saneada)",
        col = colorRampPalette(c("navy","white","firebrick"))(50))


#Generación de archivo limpio para análisis posterior.
write.csv(dfR, "C:/Users/carpi/Downloads/R-JD/Practica 3/df_listo_para_tratar_outliers.csv", row.names = FALSE)
getwd()

# ================================Modelado
#Construya una serie temporal diaria del consumo total.
#Descomponga la serie con STL.

library(tidyverse)
library(lubridate)
library(forecast)

dfSTL <- read.csv("C:/Users/carpi/Downloads/R-JD/Practica 3/df_listo_outliers_tratados_python.csv")

dfSTL$fecha <- ymd(dfSTL$fecha, quiet = TRUE)
dfSTL <- dfSTL %>% drop_na(fecha, consumo_mw)# Eliminar filas sin fecha o sin ventas
dfSTL

# Agregar ventas por d?a (para crear la serie temporal)
df_dia <- dfSTL %>%
  group_by(fecha = as_date(fecha)) %>%
  summarise(consumo_mw = sum(consumo_mw), .groups = "drop")

# Crear serie temporal diaria con frecuencia 7 (ciclo semanal)

ts_ventas <- ts(df_dia$consumo_mw,
                frequency = 7)   # frecuencia semanal

stl_model <- stl(ts_ventas, s.window = "periodic")


plot(ts_ventas,
     main = "Serie temporal de consumo_mw diarias",
     ylab = "consumo_total",
     xlab = "Tiempo",
     col = "blue")

# Mostrar componentes
plot(stl_model, main = "Descomposici?n STL de consumo_mw diario")

# ================================