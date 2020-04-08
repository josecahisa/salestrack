from django.contrib import admin
from django import forms

from clients.models import Fiscal_Position, \
    Client, \
    Address_Type, \
    Address, \
    Phone_Type, \
    Telephone, \
    Country, \
    Region, \
    City

admin.site.register(Fiscal_Position)
admin.site.register(Address_Type)
admin.site.register(Phone_Type)
admin.site.register(Country)
admin.site.register(Region)
admin.site.register(City)

class ClientAdminForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super(ClientAdminForm, self).__init__(*args, **kwargs)

    class Meta:
        model = Client
        fields = [
            'name',
            'status',
            'fiscal_position',
            'nit'
        ]

        labels = {
            'name': 'Nombre',
            'fiscal_position': 'Posición Fiscal',
            'status': 'Estado',
            'nit': 'NIT'
        }

class AddressAdminInline(admin.TabularInline):
    extra = 0
    model = Address
    
    class Meta:
        fields = [
            'address_type',
            'address',
            'description',
            'city'
        ]

        labels = {
            'address_type': 'Tipo',
            'address': 'Dirección',
            'description': 'Descripción',
            'city': 'Ciudad'
        }

    # Remove Add / update / Delete icons from the inline Form
    # def formfield_for_dbfield(self, db_field, request, **kwargs):
    #     formfield = super(AddressAdminInline, self).formfield_for_dbfield(
    #         db_field, request, **kwargs)
    #     if db_field.name == 'address':
    #         formfield.widget.can_add_related = False
    #         formfield.widget.can_change_related = False
    #         formfield.widget.can_delete_related = False
    #     return formfield


class PhoneAdminInline(admin.TabularInline):
    model = Telephone
    extra = 0

    # Remove Add / update / Delete icons from the inline Form
    def formfield_for_dbfield(self, db_field, request, **kwargs):
        formfield = super(PhoneAdminInline, self).formfield_for_dbfield(
            db_field, request, **kwargs)
        if db_field.name == 'telephone':
            formfield.widget.can_add_related = False
            formfield.widget.can_change_related = False
            formfield.widget.can_delete_related = False
        return formfield


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    form = ClientAdminForm

    list_display = ['name', 'fiscal_position']
    list_display_links = ['name']
    list_editable = ('fiscal_position', )
    ordering = ['name']
    search_fields = [ 'name']
    list_filter = ('fiscal_position',)

    inlines = [PhoneAdminInline, AddressAdminInline]

    fieldsets = (
        (None, {
            'fields': (
                ('name', 'status'),
                ('nit', 'fiscal_position')
            )
        }),
    )    