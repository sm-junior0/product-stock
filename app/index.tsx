import { Text, View, ScrollView, Platform, Pressable, TextInput, Modal } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";

const initialProducts = [
  { id: "p1", name: "Wireless Headphones", price: 59.99, stock: 32 },
  { id: "p2", name: "Bluetooth Speaker", price: 39.5, stock: 18 },
  { id: "p3", name: "USB-C Charger", price: 14.99, stock: 120 },
  { id: "p4", name: "Smartwatch Band", price: 9.99, stock: 64 },
  { id: "p5", name: "Portable SSD 500GB", price: 79.0, stock: 9 },
  { id: "p6", name: "Gaming Mouse", price: 24.25, stock: 41 },
  { id: "p7", name: "Mechanical Keyboard", price: 89.0, stock: 7 },
  { id: "p8", name: "Webcam 1080p", price: 49.99, stock: 15 },
  { id: "p9", name: "Smartphone Case", price: 12.99, stock: 22 },
  { id: "p10", name: "Wireless Mouse", price: 19.99, stock: 34 },
  { id: "p11", name: "Smart TV 55-inch", price: 899.0, stock: 5 },
  { id: "p12", name: "Wireless Earbuds", price: 49.99, stock: 28 },
  { id: "p13", name: "External SSD 1TB", price: 129.99, stock: 17 },
  { id: "p14", name: "Smart Home Hub", price: 149.0, stock: 8 },
  { id: "p15", name: "Gaming Headset", price: 59.99, stock: 20 },
];

export default function Index() {
  const [products, setProducts] = useState(initialProducts);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [query, setQuery] = useState("");
  const [cartVisible, setCartVisible] = useState(false);
  const [cartQuery, setCartQuery] = useState("");

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => p.name.toLowerCase().includes(q));
  }, [products, query]);

  const handleAddToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product || product.stock <= 0) return;
    setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, stock: p.stock - 1 } : p)));
    setCart((prev) => ({ ...prev, [productId]: (prev[productId] ?? 0) + 1 }));
  };

  const handleRemoveFromCart = (productId: string) => {
    const qty = cart[productId] ?? 0;
    if (qty <= 0) return;
    setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, stock: p.stock + 1 } : p)));
    setCart((prev) => {
      const nextQty = qty - 1;
      const next = { ...prev } as Record<string, number>;
      if (nextQty <= 0) {
        delete next[productId];
      } else {
        next[productId] = nextQty;
      }
      return next;
    });
  };

  const totalCartItems = useMemo(() => Object.values(cart).reduce((sum, qty) => sum + qty, 0), [cart]);

  const cartItemsDetailed = useMemo(() => {
    return Object.entries(cart).map(([productId, qty]) => {
      const p = products.find((pp) => pp.id === productId) || initialProducts.find((pp) => pp.id === productId);
      return { id: productId, name: p?.name ?? productId, price: p?.price ?? 0, qty, subtotal: (p?.price ?? 0) * qty };
    });
  }, [cart, products]);

  const cartTotal = useMemo(() => cartItemsDetailed.reduce((sum, item) => sum + item.subtotal, 0), [cartItemsDetailed]);

  const filteredCartItems = useMemo(() => {
    const q = cartQuery.trim().toLowerCase();
    if (!q) return cartItemsDetailed;
    return cartItemsDetailed.filter((i) => i.name.toLowerCase().includes(q));
  }, [cartItemsDetailed, cartQuery]);

  const handleSubmitCart = () => {
    setCart({});
    setCartVisible(false);
    setCartQuery("");
  };
  return (
    <View style={{ flex: 1, backgroundColor: "#0B0F14" }}>
      <ScrollView
        style={{ flex: 1, backgroundColor: "#0B0F14" }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: Platform.select({ ios: 12, android: 8, default: 8 }),
          paddingBottom: 24,
        }}
        showsVerticalScrollIndicator={false}
        overScrollMode={"never"}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{
            paddingVertical: 12,
            gap: 14,
          }}
        >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <MaterialCommunityIcons name="warehouse" size={26} color="#6EB1FF" />
          <Text
            style={{
              color: "#E6EDF3",
              fontSize: 22,
              lineHeight: 28,
              fontFamily: "Inter_700Bold",
            }}
          >
            Products in stock
          </Text>
        </View>

        <Text style={{ color: "#93A1AE", fontSize: 14, lineHeight: 20, fontFamily: "Inter_400Regular" }}>Browse the available inventory.</Text>

        <View style={{ backgroundColor: "#0E1622", borderColor: "#223042", borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 }}>
          <TextInput
            placeholder="Search products"
            placeholderTextColor="#6A7684"
            value={query}
            onChangeText={setQuery}
            style={{ color: "#E6EDF3", fontFamily: "Inter_400Regular", fontSize: 14 }}
          />
        </View>

        <View style={{ rowGap: 12 }}>
          {filteredProducts.map((p) => (
            <View
              key={p.id}
              style={{
                backgroundColor: "#121923",
                borderColor: "#223042",
                borderWidth: 1,
                borderRadius: 12,
                padding: 14,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flex: 1 }}>
                  <MaterialCommunityIcons name="package-variant-closed" size={18} color="#9FB0C1" />
                  <Text style={{ color: "#E6EDF3", fontFamily: "Inter_500Medium", fontSize: 15 }} numberOfLines={1}>
                    {p.name}
                  </Text>
                </View>
                <Text style={{ color: "#E6EDF3", fontFamily: "Inter_700Bold", fontSize: 16 }}>
                  ${p.price.toFixed(2)}
                </Text>
              </View>

              <View style={{ marginTop: 8 }}>
                <View
                  style={{
                    alignSelf: "flex-start",
                    backgroundColor: "#10331F",
                    borderColor: "#1E6E3A",
                    borderWidth: 1,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ color: "#4CD389", fontFamily: "Inter_500Medium", fontSize: 12 }}>In stock: {p.stock} {cart[p.id] ? `(in cart: ${cart[p.id]})` : ""}</Text>
                </View>
              </View>

              <View style={{ marginTop: 12, flexDirection: "row", justifyContent: "flex-end", columnGap: 10 }}>
                <Pressable
                  onPress={() => handleRemoveFromCart(p.id)}
                  disabled={(cart[p.id] ?? 0) <= 0}
                  style={{
                    opacity: (cart[p.id] ?? 0) <= 0 ? 0.6 : 1,
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#241B1B",
                    borderColor: "#3A2B2B",
                    borderWidth: 1,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 10,
                  }}
                >
                  <Text style={{ color: "#f23353", fontFamily: "Inter_500Medium", fontSize: 13 }}>Remove Item</Text>
                </Pressable>

                <Pressable
                  onPress={() => handleAddToCart(p.id)}
                  disabled={p.stock <= 0}
                  style={{
                    opacity: p.stock <= 0 ? 0.6 : 1,
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#182330",
                    borderColor: "#223042",
                    borderWidth: 1,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 10,
                  }}
                >
                  <Text style={{ color: "#E6EDF3", fontFamily: "Inter_500Medium", fontSize: 13 }}>{p.stock > 0 ? "Add to cart" : "Out of stock"}</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </View>
      </ScrollView>

    {totalCartItems > 0 && (
      <View
        style={{
          position: "absolute",
          right: 16,
          bottom: 20,
          backgroundColor: "#1A2840",
          borderColor: "#223042",
          borderWidth: 1,
          paddingHorizontal: 14,
          paddingVertical: 12,
          borderRadius: 20,
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        }}
      >
        <Pressable onPress={() => setCartVisible(true)} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <MaterialCommunityIcons name="cart" size={18} color="#E6EDF3" />
          <Text style={{ color: "#E6EDF3", fontFamily: "Inter_500Medium" }}>{totalCartItems}</Text>
        </Pressable>
      </View>
    )}

    <Modal visible={cartVisible} transparent animationType="slide" onRequestClose={() => setCartVisible(false)}>
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end" }}>
        <View style={{ backgroundColor: "#0B0F14", borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 16, borderColor: "#223042", borderWidth: 1 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Text style={{ color: "#E6EDF3", fontFamily: "Inter_700Bold", fontSize: 18 }}>Your Cart</Text>
            <Pressable onPress={() => setCartVisible(false)} style={{ padding: 6 }}>
              <MaterialCommunityIcons name="close" size={20} color="#9FB0C1" />
            </Pressable>
          </View>

          {cartItemsDetailed.length === 0 ? (
            <Text style={{ color: "#9FB0C1", fontFamily: "Inter_400Regular" }}>Your cart is empty.</Text>
          ) : (
            <View style={{ rowGap: 10, maxHeight: 420 }}>
              <View style={{ rowGap: 10 }}>
                <View style={{ backgroundColor: "#0E1622", borderColor: "#223042", borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 }}>
                  <TextInput
                    placeholder="Search in cart"
                    placeholderTextColor="#6A7684"
                    value={cartQuery}
                    onChangeText={setCartQuery}
                    style={{ color: "#E6EDF3", fontFamily: "Inter_400Regular", fontSize: 14 }}
                  />
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 6, columnGap: 8 }}>
                  {filteredCartItems.map((item) => (
                    <View key={`chip-${item.id}`} style={{ flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#121923", borderColor: "#223042", borderWidth: 1, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16 }}>
                      <MaterialCommunityIcons name="package-variant-closed" size={16} color="#9FB0C1" />
                      <Text style={{ color: "#E6EDF3" }} numberOfLines={1}>{item.name}</Text>
                      <Text style={{ color: "#93A1AE" }}>x{item.qty}</Text>
                    </View>
                  ))}
                </ScrollView>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ rowGap: 10 }}>
                {filteredCartItems.map((item) => (
                  <View key={item.id} style={{ borderColor: "#223042", borderWidth: 1, borderRadius: 10, padding: 12, backgroundColor: "#121923" }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                      <Text style={{ color: "#E6EDF3", fontFamily: "Inter_500Medium" }}>{item.name}</Text>
                      <Text style={{ color: "#E6EDF3", fontFamily: "Inter_700Bold" }}>x{item.qty}</Text>
                    </View>
                    <View style={{ marginTop: 6, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                      <Text style={{ color: "#9FB0C1" }}>Subtotal: ${item.subtotal.toFixed(2)}</Text>
                      <Pressable
                        onPress={() => handleRemoveFromCart(item.id)}
                        style={{ backgroundColor: "#241B1B", borderColor: "#3A2B2B", borderWidth: 1, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 }}
                      >
                        <Text style={{ color: "#E6EDF3" }}>Remove one</Text>
                      </Pressable>
                    </View>
                  </View>
                ))}
              </ScrollView>

              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                <Text style={{ color: "#E6EDF3", fontFamily: "Inter_700Bold", fontSize: 16 }}>Total: ${cartTotal.toFixed(2)}</Text>
                <Pressable
                  onPress={handleSubmitCart}
                  style={{ backgroundColor: "#182330", borderColor: "#223042", borderWidth: 1, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10 }}
                >
                  <Text style={{ color: "#E6EDF3", fontFamily: "Inter_500Medium" }}>Submit</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
    </View>
  );
}
