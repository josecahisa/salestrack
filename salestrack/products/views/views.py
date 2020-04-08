from django.shortcuts import render
from django.http import HttpResponse
from django.core import serializers
from django.db import models
import csv
import xlwt
from datetime import date, datetime
from django.contrib.auth.decorators import login_required
from django.forms import ModelForm, Textarea, Form, FileField
from products.models import *

class CsvImportForm(Form):
    csv_file = FileField()

@login_required
def import_products(request):
    if request.method == "POST":
        csv_file = request.FILES["csv_file"]

        for row in csv.DictReader(csv_file.read().decode("utf-8").splitlines()):
            business_unit_name = row['UNIDAD DE NEGOCIO'].capitalize().strip()

            if business_unit_name:
                try:
                    business_unit = Business_Unit.objects.get(name__iexact=business_unit_name)
                except:
                    business_unit = Business_Unit(name=business_unit_name)
                    business_unit.save()

                classification_name = row['CLASIFICACION'].capitalize().strip()

                try:
                    classification = Classification.objects.get(name__iexact=classification_name)
                except:
                    classification = Classification(
                        name=classification_name
                    )
                    classification.save()

                category_name = row['RUBRO'].capitalize().strip()

                try:
                    category = Category.objects.get(name__iexact=category_name)
                except:
                    category = Category(
                        name=category_name
                    )
                    category.save()

                brand_name = row['DESC_MARCA'].capitalize().strip()

                try:
                    brand = Brand.objects.get(name__iexact=brand_name)
                except:
                    brand = Brand(name=brand_name)
                    brand.save()

                provider_alpha_code = row['COD_LISPRE'].upper().strip()
                provider_code = row['CODIGO'].upper().strip()
                description = row['DETALLE'].upper().strip()
                # wholesale_price_str = row['PRECIO'].upper().strip()

                try:
                    product = Product.objects.get(provider_code__iexact=provider_code)
                    print('Product already exist = ' + provider_code)
                except:
                    product = Product(
                        description = description,
                        status = 'A',
                        # wholesale_price = 0,
                        provider_alpha_code = provider_alpha_code,
                        provider_code = provider_code,
                        business_unit = business_unit,
                        brand = brand,
                        classification = classification,
                        category = category
                    )
                    product.save()

        form = CsvImportForm()
        payload = {"form": form}
    else:
        form = CsvImportForm()
        payload = {"form": form}
    return render(
            request, "products/import_csv_products.html", payload
        )