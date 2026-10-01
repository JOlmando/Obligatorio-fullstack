export const obtenerAlimentosService = async (comida) => {

    const comidas = {
        desayuno: "breakfast",
        almuerzo: "lunch",
        merienda: "snack",
        cena: "dinner"
    };

    const termino = comidas[comida];

    if (!termino) {
        const error = new Error({  status_code: 400, message: "La comida debe ser desayuno, almuerzo, merienda o cena" });
        error.status = 400;
        throw error;
    }

    const url = new URL(
        "https://world.openfoodfacts.org/cgi/search.pl"
    );

    url.searchParams.set("search_terms", termino);
    url.searchParams.set("search_simple", "1");
    url.searchParams.set("action", "process");
    url.searchParams.set("json", "1");
    url.searchParams.set("page_size", "20");

    // Pedimos solamente lo que vamos a utilizar
    url.searchParams.set(
        "fields",
        "code,product_name,ingredients_text,nutriments,nutrition_grades"
    );

    let response;

    try {
        response = await fetch(url, {
            headers: {
                "User-Agent":
                    "GymApp/1.0 (proyecto-ort)"
            }
        });
    } catch (error) {

        const apiError = new Error({  status_code: 503, message: 'No se pudo conectar con el servicio de nutrición' });
        apiError.status = 503;

        throw apiError;
    }

    if (!response.ok) {
        const apiError = new Error({  status_code: 503, message: 'El servicio de nutrición no está disponible' });

        apiError.status = 503;

        throw apiError;
    }

    const data = await response.json();

    const productos = data.products
    .filter((producto) => {
        return (
            producto.product_name &&
            ["a", "b"].includes(producto.nutrition_grades)
        );
    })
    .map((producto) => ({
        codigo: producto.code,
        nombre: producto.product_name,
        ingredientes: producto.ingredients_text || null,
        nutricion: producto.nutriments || {},
        nutriScore: producto.nutrition_grades
    }));

    return {
        comida,
        productos
    };
};