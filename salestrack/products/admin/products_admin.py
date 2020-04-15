from django.contrib import admin
from django import forms

from products.models import Product, \
    Business_Unit, \
    Brand, \
    Classification, \
    Category


# admin.site.register(Product)
admin.site.register(Business_Unit)
admin.site.register(Brand)
admin.site.register(Classification)
admin.site.register(Category)
from string import Template
from django.utils.safestring import mark_safe
from django.forms import ImageField

class PictureWidget(forms.widgets.FileInput):
    def render(self, name, value, attrs=None, **kwargs):
        html =  Template("""<img src="$link" style="width: 200px; height:200px;"/>""")
        
        input_html = super().render(name, value, attrs=None, **kwargs)
        img_html = mark_safe(html.substitute(link=value.url))

        if value:
            return f'{input_html}{img_html}'
            # return f'{img_html}'
        else:
            return ''

class ProductAdminForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super(ProductAdminForm, self).__init__(*args, **kwargs)

    photo = ImageField(widget=PictureWidget)

    class Meta:
        model = Product
        fields = [
            'provider_alpha_code', 'provider_code', 'description', 'business_unit', 
            'brand', 'classification', 'category', 'status', 'photo', 'is_accesory',
            'free_accesories'
        ]

        labels = {
            'provider_alpha_code': 'Código Ext',
            'provider_code': 'Código',
            'description': 'Descripción',
            'business_unit': 'Unidad de Negocios',
            'brand': 'Marca',
            'classification': 'Clasificación',
            'category': 'Categoría',
            'status': 'Estado',
            'photo': 'Foto',
            'free_accesories': 'Accesorios Incluidos',
            'is_accesory': 'Este producto es un Accesorio'
        }

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    form = ProductAdminForm

    list_display = ['photo_thumbnail', 'provider_alpha_code', 'provider_code', 'description', 'business_unit', 
        'brand', 'classification', 'category', 'status' ]
    list_display_links = ['provider_alpha_code', 'provider_code']
    list_editable = ('status', 'description')
    ordering = ['category', 'provider_code']
    search_fields = [ 'description', 'provider_alpha_code', 'provider_code']
    list_filter = ('business_unit', 'brand', 'classification', 'category')

    fieldsets = (
        ('', {
            'fields': (
                ('provider_alpha_code', 'provider_code'),
                ('description', 'status'),
                ('is_accesory'),
                ('free_accesories')
            )
        }),
        ('', {
            'fields' : (
                ('business_unit', 'brand'),
                ('classification', 'category'),
            )
        }),
        ('', {
            'fields' : (
                'photo',
            )
        })
    )
