from datetime import datetime, timedelta
from typing import Dict, List, Optional
from uuid import uuid4

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr

app = FastAPI(title="FoodiesZenith API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class CategoryIn(BaseModel):
    name: str
    description: Optional[str] = None
    order: int = 0


class MenuItemIn(BaseModel):
    category_id: str
    name: str
    description: str
    price: float
    image_url: str = ""
    dietary_flags: Dict = {}
    available: bool = True


class RestaurantInfo(BaseModel):
    name: str
    address: str
    phone: str
    email: str
    hours: Dict[str, str]
    story: str
    social_links: Dict[str, str]


db = {
    "users": [
        {
            "id": str(uuid4()),
            "email": "admin@foodieszenith.com",
            "password_hash": "password123",
            "role": "admin",
            "created_at": datetime.utcnow().isoformat(),
        }
    ],
    "categories": [
        {"id": "c1", "name": "Appetisers", "description": "Start light", "order": 1},
        {"id": "c2", "name": "Mains", "description": "Chef specials", "order": 2},
        {"id": "c3", "name": "Desserts", "description": "Sweet finishes", "order": 3},
    ],
    "items": [
        {
            "id": "m1",
            "category_id": "c1",
            "name": "Crispy Lotus Stem",
            "description": "Honey-chilli glaze",
            "price": 299,
            "image_url": "",
            "dietary_flags": {"vegetarian": True, "vegan": False, "gluten_free": True, "spice_level": 2},
            "available": True,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat(),
        },
        {
            "id": "m2",
            "category_id": "c2",
            "name": "Smoked Paneer Steak",
            "description": "Millet tabbouleh and pepper jus",
            "price": 449,
            "image_url": "",
            "dietary_flags": {"vegetarian": True, "vegan": False, "gluten_free": True, "spice_level": 1},
            "available": False,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat(),
        },
        {
            "id": "m3",
            "category_id": "c3",
            "name": "Saffron Tres Leches",
            "description": "Cardamom milk sponge with pistachio dust",
            "price": 349,
            "image_url": "",
            "dietary_flags": {"vegetarian": True, "vegan": False, "gluten_free": False, "spice_level": 0},
            "available": True,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat(),
        },
    ],
    "restaurant_info": {
        "name": "FoodiesZenith",
        "address": "12 Gourmet Street, Bengaluru",
        "phone": "+91 90000 12345",
        "email": "hello@foodieszenith.com",
        "hours": {
            "monday": "10:00-22:00",
            "tuesday": "10:00-22:00",
            "wednesday": "10:00-22:00",
            "thursday": "10:00-22:00",
            "friday": "10:00-23:00",
            "saturday": "10:00-23:00",
            "sunday": "10:00-23:00",
        },
        "story": "FoodiesZenith celebrates comforting plates with modern techniques.",
        "social_links": {
            "instagram": "https://instagram.com/foodieszenith",
            "x": "https://x.com/foodieszenith",
        },
    },
}


def grouped_menu(items: List[Dict], featured: bool = False):
    categories = sorted(db["categories"], key=lambda c: c["order"])
    out = []
    for category in categories:
        cat_items = [i for i in items if i["category_id"] == category["id"]]
        if featured:
            cat_items = cat_items[:2]
        out.append({**category, "items": cat_items})
    return out


@app.post("/auth/login")
def login(payload: LoginIn):
    user = next((u for u in db["users"] if u["email"] == payload.email and u["password_hash"] == payload.password), None)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"access_token": f"demo-token-{user['id']}", "token_type": "bearer", "expires_in": 3600}


@app.post("/auth/register")
def register(payload: LoginIn):
    if any(u["email"] == payload.email for u in db["users"]):
        raise HTTPException(status_code=400, detail="Email already used")
    user = {
        "id": str(uuid4()),
        "email": str(payload.email),
        "password_hash": payload.password,
        "role": "editor",
        "created_at": datetime.utcnow().isoformat(),
    }
    db["users"].append(user)
    return user


@app.post("/auth/refresh")
def refresh():
    return {"access_token": f"refresh-{uuid4()}", "expires_in": int(timedelta(hours=1).total_seconds())}


@app.get("/menu")
def get_menu(featured: bool = Query(default=False)):
    return grouped_menu(db["items"], featured=featured)


@app.get("/menu/highlights")
def menu_highlights(limit: int = Query(default=4, ge=1, le=12)):
    available_items = [item for item in db["items"] if item["available"]]
    ranked = sorted(available_items, key=lambda item: (item["price"], item["name"]))
    return ranked[:limit]


@app.get("/menu/categories")
def get_categories():
    return db["categories"]


@app.post("/menu/categories")
def create_category(payload: CategoryIn):
    new_category = {"id": str(uuid4()), **payload.model_dump()}
    db["categories"].append(new_category)
    return new_category


@app.get("/menu/items/{item_id}")
def get_item(item_id: str):
    item = next((i for i in db["items"] if i["id"] == item_id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@app.post("/menu/items")
def create_item(payload: MenuItemIn):
    item = {
        "id": str(uuid4()),
        **payload.model_dump(),
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat(),
    }
    db["items"].append(item)
    return item


@app.put("/menu/items/{item_id}")
def update_item(item_id: str, payload: MenuItemIn):
    for idx, item in enumerate(db["items"]):
        if item["id"] == item_id:
            db["items"][idx] = {**item, **payload.model_dump(), "updated_at": datetime.utcnow().isoformat()}
            return db["items"][idx]
    raise HTTPException(status_code=404, detail="Item not found")


@app.patch("/menu/items/{item_id}/availability")
def toggle_availability(item_id: str):
    for item in db["items"]:
        if item["id"] == item_id:
            item["available"] = not item["available"]
            item["updated_at"] = datetime.utcnow().isoformat()
            return item
    raise HTTPException(status_code=404, detail="Item not found")


@app.delete("/menu/items/{item_id}")
def delete_item(item_id: str):
    db["items"] = [item for item in db["items"] if item["id"] != item_id]
    return {"deleted": item_id}


@app.get("/menu/search")
def search_menu(
    q: str = "",
    category_id: Optional[str] = None,
    vegetarian: Optional[bool] = None,
    vegan: Optional[bool] = None,
    gluten_free: Optional[bool] = None,
    available: Optional[bool] = None,
    spice_level: Optional[int] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
):
    results = db["items"]
    if q:
        results = [item for item in results if q.lower() in item["name"].lower() or q.lower() in item["description"].lower()]
    if category_id:
        results = [item for item in results if item["category_id"] == category_id]
    for key, value in [("vegetarian", vegetarian), ("vegan", vegan), ("gluten_free", gluten_free)]:
        if value is not None:
            results = [item for item in results if item["dietary_flags"].get(key) == value]
    if available is not None:
        results = [item for item in results if item["available"] == available]
    if spice_level is not None:
        results = [item for item in results if item["dietary_flags"].get("spice_level") == spice_level]
    if min_price is not None:
        results = [item for item in results if item["price"] >= min_price]
    if max_price is not None:
        results = [item for item in results if item["price"] <= max_price]
    return sorted(results, key=lambda item: item["price"])


@app.get("/dashboard/summary")
def dashboard_summary():
    items = db["items"]
    available_items = [item for item in items if item["available"]]
    avg_ticket = round(sum(item["price"] for item in available_items) / max(1, len(available_items)), 2)
    return {
        "categories": len(db["categories"]),
        "total_items": len(items),
        "available_items": len(available_items),
        "unavailable_items": len(items) - len(available_items),
        "avg_ticket": avg_ticket,
        "last_updated": datetime.utcnow().isoformat(),
    }


@app.get("/qr/menu")
def qr_menu(size: int = 200, format: str = "svg"):
    if format.lower() != "svg":
        raise HTTPException(status_code=400, detail="Only SVG format is implemented in this starter")
    side = max(100, min(size, 600))
    svg = f"""<svg xmlns='http://www.w3.org/2000/svg' width='{side}' height='{side}' viewBox='0 0 21 21'>
<rect width='21' height='21' fill='white'/>
<rect x='1' y='1' width='5' height='5' fill='black'/><rect x='15' y='1' width='5' height='5' fill='black'/>
<rect x='1' y='15' width='5' height='5' fill='black'/><rect x='8' y='8' width='2' height='2' fill='black'/>
<rect x='10' y='10' width='2' height='2' fill='black'/><rect x='12' y='12' width='2' height='2' fill='black'/>
<text x='1' y='20' font-size='1.5'>foodieszenith.com/menu</text></svg>"""
    return svg


@app.get("/restaurant/info")
def get_restaurant_info():
    return db["restaurant_info"]


@app.put("/restaurant/info")
def update_restaurant_info(payload: RestaurantInfo):
    db["restaurant_info"] = payload.model_dump()
    return db["restaurant_info"]


@app.get("/reviews")
def get_reviews():
    return [
        {"name": "Aarav", "rating": 5, "comment": "Excellent service and quick QR menu flow."},
        {"name": "Maya", "rating": 5, "comment": "Great vegan options and clear labels."},
        {"name": "Reyansh", "rating": 4, "comment": "Loved the seasonal desserts and fast seating."},
    ]


@app.post("/giftcards/purchase")
def purchase_giftcard(amount: float, sender_name: str, sender_email: EmailStr, recipient_email: EmailStr, message: str = ""):
    return {
        "code": f"FZ-{str(uuid4())[:8].upper()}",
        "amount": amount,
        "sender_name": sender_name,
        "sender_email": sender_email,
        "recipient_email": recipient_email,
        "message": message,
        "issued_at": datetime.utcnow().isoformat(),
        "status": "active",
    }


@app.get("/giftcards/{code}")
def get_giftcard(code: str):
    return {"code": code, "status": "active", "remaining": 1200}
