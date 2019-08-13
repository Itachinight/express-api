INSERT INTO express_api.attributes (id, name) VALUES (1, 'Color');
INSERT INTO express_api.attributes (id, name) VALUES (2, 'Width');
INSERT INTO express_api.attributes (id, name) VALUES (3, 'Length');
INSERT INTO express_api.attributes (id, name) VALUES (5, 'CPU');
INSERT INTO express_api.categories (id, name, description) VALUES (1, 'Gaming Consoles', 'Ipsum Lorem');
INSERT INTO express_api.categories (id, name, description) VALUES (2, 'Smartphones', 'Lorem Ipsum');
INSERT INTO express_api.categories (id, name, description) VALUES (3, 'Notebooks', 'Lorem Ipsum');
INSERT INTO express_api.categories (id, name, description) VALUES (4, 'Electronics', 'Lorem Ipsum');
INSERT INTO express_api.categories (id, name, description) VALUES (7, 'TestCategory', 'Ipsum Lorem');
INSERT INTO express_api.products (id, name, description, price, manufacturer, created) VALUES (1, 'XBOX One', 'Another Gaming Console', 269.99, 'Microsoft', '2019-08-05 16:44:30.286634');
INSERT INTO express_api.products (id, name, description, price, manufacturer, created) VALUES (2, 'PS 4', 'Another Gaming Console', 299.99, 'Sony', '2019-08-05 16:44:52.706963');
INSERT INTO express_api.products (id, name, description, price, manufacturer, created) VALUES (3, 'Switch', 'Another Gaming Console', 199.99, 'Nintendo', '2019-08-05 18:23:23.499542');
INSERT INTO express_api.products (id, name, description, price, manufacturer, created) VALUES (4, '3310', 'The Rock', 19.99, 'Nokia', '2019-08-06 16:27:17.986717');
INSERT INTO express_api.products (id, name, description, price, manufacturer, created) VALUES (5, 'PS Vita', 'Another Gaming Console', 119.99, 'Sony', '2019-08-05 18:35:40.539103');
INSERT INTO express_api.products (id, name, description, price, manufacturer, created) VALUES (6, 'S10', 'Angry Droid', 899.99, 'Samsung', '2019-08-06 11:17:13.881196');
INSERT INTO express_api.products (id, name, description, price, manufacturer, created) VALUES (7, 'IPhone X', 'Bited Apple', 899.99, 'Apple', '2019-08-06 11:18:13.840166');
INSERT INTO express_api.products (id, name, description, price, manufacturer, created) VALUES (8, 'Wii U', 'Wiiiiiii U', 149.99, 'Nintendo', '2019-08-13 13:11:30.086511');
INSERT INTO express_api.products_attributes_values (productId, attributeId, value) VALUES (1, 1, 'black');
INSERT INTO express_api.products_attributes_values (productId, attributeId, value) VALUES (1, 2, '33.3cm');
INSERT INTO express_api.products_attributes_values (productId, attributeId, value) VALUES (1, 3, '27.4cm');
INSERT INTO express_api.products_categories (productId, categoryId) VALUES (1, 1);
INSERT INTO express_api.products_categories (productId, categoryId) VALUES (1, 4);
INSERT INTO express_api.products_categories (productId, categoryId) VALUES (2, 1);
INSERT INTO express_api.products_categories (productId, categoryId) VALUES (2, 4);
INSERT INTO express_api.products_categories (productId, categoryId) VALUES (3, 1);
INSERT INTO express_api.products_categories (productId, categoryId) VALUES (3, 4);
INSERT INTO express_api.products_categories (productId, categoryId) VALUES (4, 2);
INSERT INTO express_api.products_categories (productId, categoryId) VALUES (4, 4);
INSERT INTO express_api.products_categories (productId, categoryId) VALUES (5, 1);
INSERT INTO express_api.products_categories (productId, categoryId) VALUES (5, 4);
INSERT INTO express_api.products_categories (productId, categoryId) VALUES (6, 2);
INSERT INTO express_api.products_categories (productId, categoryId) VALUES (6, 4);
INSERT INTO express_api.products_categories (productId, categoryId) VALUES (7, 2);
INSERT INTO express_api.products_categories (productId, categoryId) VALUES (7, 4);
INSERT INTO express_api.products_categories (productId, categoryId) VALUES (8, 1);
INSERT INTO express_api.products_categories (productId, categoryId) VALUES (8, 4);
INSERT INTO express_api.users (id, name, surname, login, password, role) VALUES (1, 'Roman', 'Kulish', 'itachinight', 'c2NyeXB0ABAAAAAIAAAAAXcixE3nG/22SjEYbi+BTx0keP6e43QydaW4wFXILeqIq1QgA0VO44hTLpXSUZ2rBetHkYNJp3YU6wjYl6A9WZKlzFSnYSvDNrEQq0yJdyQo', 'admin');
INSERT INTO express_api.users (id, name, surname, login, password, role) VALUES (2, 'John', 'Dow', 'test', 'c2NyeXB0ABAAAAAIAAAAAep5WwkKy7yJqDxDL6r4lour+TB86LRzS0piHAg5UVOFFrVvmS6dHuOtJJAOX4UWVjyv99HmhpIfpAEQQHIJqTCp0mihZzvyfg977sqDRMjt', 'user');