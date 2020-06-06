from django.contrib import admin
from django import forms

from products.models import Product, \
    Business_Unit, \
    Brand, \
    Classification, \
    Category, \
    Product_Type

admin.site.register(Business_Unit)
admin.site.register(Brand)
admin.site.register(Classification)
admin.site.register(Category)
from string import Template
from django.utils.safestring import mark_safe
from django.forms import ImageField

# class PictureWidget(forms.widgets.FileInput):
#     def render(self, name, value, attrs=None, **kwargs):
#         html =  Template("""<img src="$link" style="width: 200px; height:200px;"/>""")
        
#         input_html = super().render(name, value, attrs=None, **kwargs)
#         img_html = mark_safe(html.substitute(link=value.url))

#         if value:
#             return f'{input_html}{img_html}'
#         else:
#             return ''

class ProductAdminForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super(ProductAdminForm, self).__init__(*args, **kwargs)

    class Meta:
        model = Product
        fields = [
            'product_type', 'product_code', 'description', 'business_unit', 
            # 'product_type__brand', 
            'classification', 'category', 'status', 'photo', 'is_accesory',
            'free_accesories', 'wholesale_price'
        ]

        labels = {
            'product_type': 'Tipo de Producto',
            'product_code': 'Código',
            'description': 'Descripción',
            'business_unit': 'Unidad de Negocios',
            # 'product_type__brand': 'Marca',
            'classification': 'Clasificación',
            'category': 'Categoría',
            'status': 'Estado',
            'photo': 'Foto',
            'free_accesories': 'Accesorios Incluidos',
            'is_accesory': 'Es un Accesorio'
        }

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    form = ProductAdminForm

    list_display = [
        'photo_thumbnail', 
        'product_type', 
        'product_code',
        'description',
        'business_unit', 
        'get_brand', 
        'classification',
        'category',
        'status'
    ]
    list_display_links = [
        'product_type', 
        'product_code'
    ]
    list_editable = ('status', 'description')
    ordering = [
        'category',
        'product_code'
    ]
    search_fields = (
        'description', 
        'product_type__code', 
        'product_code'
    )
    list_filter = (
        'business_unit', 
        # 'product_type__brand', 
        'classification',
        'category'
    )

    fieldsets = (
        ('', {
            'fields': (
                (
                    'product_type', 
                    'product_code',
                    'status',
                    'is_accesory'
                ),
                ('description', 'wholesale_price'),
                ('free_accesories')
            )
        }),
        ('', {
            'fields' : (
                ('business_unit', 
                # 'product_type__brand'
                ),
                ('classification', 'category'),
            )
        }),
        ('', {
            'fields' : (
                'photo',
            )
        })
    )

########################## 
# 
#   PRODUCT TYPE ADMIN
# 
##########################

class ProductTypeAdminForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super(ProductTypeAdminForm, self).__init__(*args, **kwargs)

    class Meta:
        model = Product_Type
        fields = [
            'code', 'brand', 'photo'
        ]

        labels = {
            'code': 'Código',
            'brand': 'Marca',
            'photo': 'Foto'
        }

@admin.register(Product_Type)
class ProductTypeAdmin(admin.ModelAdmin):
    form = ProductTypeAdminForm

